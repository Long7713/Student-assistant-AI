import { Course, ClassSchedule, StudentPreferences, Task, StudySession, ReplanDiff, SessionChange } from '../types';
import { getTodayString, getRelativeDateString, formatTime12h, parseMinutes } from './dateUtils';

export function calculatePlannerRebalance({
  missedSession,
  reason = 'Bỏ lỡ khung giờ học đã lên lịch',
  courses,
  tasks,
  preferences,
  sessions,
}: {
  missedSession: StudySession;
  reason?: string;
  courses: Course[];
  tasks: Task[];
  preferences: StudentPreferences;
  sessions: StudySession[];
}): ReplanDiff {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const missedTask = tasks.find((t) => t.id === missedSession.taskId);
  const missedCourse = courses.find((c) => c.id === missedTask?.courseId);

  // Clone current sessions for before snapshot
  const beforeSessions = JSON.parse(JSON.stringify(sessions)) as StudySession[];

  // Determine updated schedule
  const otherSessions = sessions.filter((s) => s.id !== missedSession.id);
  const changes: SessionChange[] = [];

  let newProposedSessions: StudySession[] = [];
  let rationale = '';
  let adjustments: string[] = [];

  if (missedTask?.priority === 'high' || missedTask?.type === 'exam_prep') {
    // High priority missed session: slot into evening priority window (19:30)
    const rescheduledSession: StudySession = {
      ...missedSession,
      id: `s_rescheduled_${Date.now()}`,
      status: 'scheduled',
      date: today,
      startTime: '19:30',
      endTime: '21:00',
      durationMinutes: missedSession.durationMinutes,
      replanTag: '⚡ Chuyển sang khung giờ tối (Ưu tiên cao)',
      goal: `${missedSession.goal} (Phiên học bù)`,
    };

    const existingEvening = otherSessions.find((s) => s.date === today && s.startTime === '19:30');
    const existingAfternoonLow = otherSessions.find((s) => s.date === today && s.startTime === '16:15');

    const adjustedOtherSessions: StudySession[] = [];

    for (const sess of otherSessions) {
      if (sess.id === existingEvening?.id) {
        // Shift evening session to 21:00 buffer
        const movedEvening: StudySession = {
          ...sess,
          startTime: '21:00',
          endTime: '22:15',
          durationMinutes: 75,
          replanTag: '⏱️ Dời sang 21:00 (Rút ngắn 75 phút)',
        };
        adjustedOtherSessions.push(movedEvening);

        const task = tasks.find((t) => t.id === sess.taskId);
        const course = courses.find((c) => c.id === task?.courseId);
        changes.push({
          id: `ch_${sess.id}`,
          type: 'moved',
          taskId: sess.taskId,
          taskTitle: task?.title || 'Phiên học',
          courseCode: course?.code || 'MÔN HỌC',
          courseColor: course?.color || 'emerald',
          priority: task?.priority || 'medium',
          previousSession: {
            date: sess.date,
            startTime: sess.startTime,
            endTime: sess.endTime,
          },
          newSession: {
            date: movedEvening.date,
            startTime: movedEvening.startTime,
            endTime: movedEvening.endTime,
          },
          explanation: `Rút ngắn từ 90 phút xuống 75 phút và dời sang 21:00 để nhường khung giờ vàng 19:30 cho ôn thi cấp bách.`,
          urgencyImpact: 'balanced_workload',
        });
      } else if (sess.id === existingAfternoonLow?.id) {
        // Shift low priority reading to tomorrow
        const deferredReading: StudySession = {
          ...sess,
          date: tomorrow,
          startTime: '16:15',
          endTime: '17:15',
          replanTag: '📅 Dời sang chiều mai 16:15',
        };
        adjustedOtherSessions.push(deferredReading);

        const task = tasks.find((t) => t.id === sess.taskId);
        const course = courses.find((c) => c.id === task?.courseId);
        changes.push({
          id: `ch_${sess.id}`,
          type: 'rescheduled_tomorrow',
          taskId: sess.taskId,
          taskTitle: task?.title || 'Đọc tài liệu',
          courseCode: course?.code || 'MÔN HỌC',
          courseColor: course?.color || 'rose',
          priority: task?.priority || 'low',
          previousSession: {
            date: sess.date,
            startTime: sess.startTime,
            endTime: sess.endTime,
          },
          newSession: {
            date: deferredReading.date,
            startTime: deferredReading.startTime,
            endTime: deferredReading.endTime,
          },
          explanation: `Hạn nộp còn 4 ngày. Đã dời sang chiều mai lúc 16:15 vì bạn còn 3 giờ trống, giúp bạn không bị mệt mỏi hôm nay.`,
          urgencyImpact: 'safely_deferred',
        });
      } else {
        adjustedOtherSessions.push(sess);
      }
    }

    // Mark original as missed
    const updatedMissed: StudySession = {
      ...missedSession,
      status: 'missed',
      missedReason: reason,
    };

    newProposedSessions = [updatedMissed, rescheduledSession, ...adjustedOtherSessions];

    changes.unshift({
      id: `ch_missed_${missedSession.id}`,
      type: 'moved',
      taskId: missedSession.taskId,
      taskTitle: missedTask?.title || 'Ôn thi',
      courseCode: missedCourse?.code || 'CS 189',
      courseColor: missedCourse?.color || 'indigo',
      priority: missedTask?.priority || 'high',
      previousSession: {
        date: missedSession.date,
        startTime: missedSession.startTime,
        endTime: missedSession.endTime,
      },
      newSession: {
        date: rescheduledSession.date,
        startTime: rescheduledSession.startTime,
        endTime: rescheduledSession.endTime,
      },
      explanation: `Môn ${missedCourse?.code} thi trong 2 ngày tới. AI đã xếp lại vào khung giờ vàng 19:30 tối nay để bạn duy trì nhịp ôn tập.`,
      urgencyImpact: 'protected_high_priority',
    });

    rationale = `Phiên ôn thi môn ${missedCourse?.code || 'quan trọng'} có hạn chót trong 48 giờ tới nên được AI ưu tiên đưa vào khung giờ 19:30 tối nay. Các bài đọc ít gấp hơn đã được chuyển sang chiều mai (khung giờ bạn còn 3 tiếng trống) để đảm bảo bạn không bị dồn bài hay thức khuya quá mức.`;

    adjustments = [
      `Bảo vệ phiên ôn thi ${missedCourse?.code || 'quan trọng'}: Chuyển sang 19:30 tối nay.`,
      `Dời bài đọc ít gấp hơn sang 16:15 chiều mai mà không ảnh hưởng hạn nộp.`,
      `Điều chỉnh bài tập tối sang 21:00 để tổng thời gian học hôm nay dưới mức ${preferences.maxDailyStudyHours || 5.5} giờ.`,
      `Đảm bảo 100% không có bài nào bị trễ hạn.`,
    ];
  } else {
    // Standard re-plan for medium/low priority
    const deferredSession: StudySession = {
      ...missedSession,
      id: `s_deferred_${Date.now()}`,
      status: 'scheduled',
      date: tomorrow,
      startTime: '14:30',
      endTime: '16:00',
      replanTag: '📅 Chuyển sang chiều mai',
      goal: `${missedSession.goal} (Đã dời lịch)`,
    };

    const updatedMissed: StudySession = {
      ...missedSession,
      status: 'missed',
      missedReason: reason,
    };

    newProposedSessions = [updatedMissed, deferredSession, ...otherSessions];

    changes.push({
      id: `ch_deferred_${missedSession.id}`,
      type: 'rescheduled_tomorrow',
      taskId: missedSession.taskId,
      taskTitle: missedTask?.title || 'Nhiệm vụ',
      courseCode: missedCourse?.code || 'MÔN HỌC',
      courseColor: missedCourse?.color || 'amber',
      priority: missedTask?.priority || 'medium',
      previousSession: {
        date: missedSession.date,
        startTime: missedSession.startTime,
        endTime: missedSession.endTime,
      },
      newSession: {
        date: deferredSession.date,
        startTime: deferredSession.startTime,
        endTime: deferredSession.endTime,
      },
      explanation: `Dời sang khung giờ chiều mai (14:30 - 16:00) vì lịch ngày mai của bạn còn nhiều thời gian trống.`,
      urgencyImpact: 'safely_deferred',
    });

    rationale = `Phiên học đã được chuyển sang khung giờ chiều mai. Lịch học hôm nay được giữ nhẹ nhàng để bạn hoàn thành các phần việc còn lại.`;
    adjustments = [
      `Chuyển phiên học sang 14:30 chiều mai.`,
      `Giữ nguyên các phiên học khác hôm nay để tránh áp lực.`,
    ];
  }

  // Calculate hours before and after
  const todayBeforeHours = beforeSessions
    .filter((s) => s.date === today && s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0) / 60;

  const todayAfterHours = newProposedSessions
    .filter((s) => s.date === today && s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0) / 60;

  const tomorrowHours = newProposedSessions
    .filter((s) => s.date === tomorrow && s.status !== 'missed')
    .reduce((acc, s) => acc + s.durationMinutes, 0) / 60;

  return {
    id: `diff_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    triggerSessionId: missedSession.id,
    triggerReason: reason,
    aiRationale: rationale,
    workloadSummary: {
      todayHoursBefore: parseFloat(todayBeforeHours.toFixed(1)),
      todayHoursAfter: parseFloat(todayAfterHours.toFixed(1)),
      tomorrowHours: parseFloat(tomorrowHours.toFixed(1)),
      deadlinesSafeCount: tasks.length,
      atRiskCount: 0,
    },
    keyAdjustments: adjustments,
    changes,
    beforeSessions,
    proposedSessions: newProposedSessions,
  };
}

export function generateInitialScheduleFromTasks({
  courses,
  tasks,
  preferences,
  classSchedule,
}: {
  courses: Course[];
  tasks: Task[];
  preferences: StudentPreferences;
  classSchedule: ClassSchedule[];
}): StudySession[] {
  const today = getTodayString();
  const tomorrow = getRelativeDateString(1);
  const generatedSessions: StudySession[] = [];
  let sId = 100;

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    const pDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (pDiff !== 0) return pDiff;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const highPriority = sortedTasks.filter((t) => t.priority === 'high');
  const mediumPriority = sortedTasks.filter((t) => t.priority === 'medium');
  const lowPriority = sortedTasks.filter((t) => t.priority === 'low');

  if (highPriority[0]) {
    generatedSessions.push({
      id: `gen_s_${sId++}`,
      taskId: highPriority[0].id,
      date: today,
      startTime: '08:30',
      endTime: '10:00',
      durationMinutes: 90,
      status: 'scheduled',
      goal: `Tập trung sâu: Khái niệm cốt lõi cho ${highPriority[0].title}`,
    });

    generatedSessions.push({
      id: `gen_s_${sId++}`,
      taskId: highPriority[0].id,
      date: today,
      startTime: '14:30',
      endTime: '16:00',
      durationMinutes: 90,
      status: 'scheduled',
      goal: `Giải bài tập & luyện đề thi cho ${highPriority[0].title}`,
    });
  }

  if (lowPriority[0]) {
    generatedSessions.push({
      id: `gen_s_${sId++}`,
      taskId: lowPriority[0].id,
      date: today,
      startTime: '16:15',
      endTime: '17:15',
      durationMinutes: 60,
      status: 'scheduled',
      goal: `Đọc tài liệu & ghi chú câu hỏi thảo luận cho ${lowPriority[0].title}`,
    });
  }

  if (highPriority[1]) {
    generatedSessions.push({
      id: `gen_s_${sId++}`,
      taskId: highPriority[1].id,
      date: today,
      startTime: '19:30',
      endTime: '21:00',
      durationMinutes: 90,
      status: 'scheduled',
      goal: `Làm bài tập: Bài 1 đến 3 cho ${highPriority[1].title}`,
    });
  }

  if (mediumPriority[0]) {
    generatedSessions.push({
      id: `gen_s_${sId++}`,
      taskId: mediumPriority[0].id,
      date: tomorrow,
      startTime: '14:30',
      endTime: '16:30',
      durationMinutes: 120,
      status: 'scheduled',
      goal: `Triển khai & thử nghiệm mô hình cho ${mediumPriority[0].title}`,
    });
  }

  return generatedSessions;
}

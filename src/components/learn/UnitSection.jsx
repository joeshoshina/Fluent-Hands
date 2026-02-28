import React from "react";
import { motion } from "framer-motion";
import LessonNode from "./LessonNode";

const pathOffsets = [0, -40, -60, -40, 0, 40, 60, 40];

export default function UnitSection({
  unit,
  lessons,
  completedLessons,
  lessonScores,
  firstLockedUnit,
  onLessonClick,
}) {
  const isUnitLocked = firstLockedUnit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          {unit}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className="flex flex-col items-center gap-6">
        {lessons.map((lesson, idx) => {
          const isCompleted = completedLessons?.includes(lesson.id);
          const prevCompleted =
            idx === 0
              ? !isUnitLocked
              : completedLessons?.includes(lessons[idx - 1]?.id);
          const isLocked = isUnitLocked || (!isCompleted && !prevCompleted);
          const scoreObj = lessonScores?.find((s) => s.lesson_id === lesson.id);

          return (
            <div
              key={lesson.id}
              style={{
                transform: `translateX(${pathOffsets[idx % pathOffsets.length]}px)`,
              }}
              className="transition-transform duration-300"
            >
              <LessonNode
                lesson={lesson}
                index={idx}
                isLocked={isLocked}
                isCompleted={isCompleted}
                score={scoreObj?.score}
                onClick={onLessonClick}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

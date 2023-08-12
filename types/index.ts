// export types

export type HabitsGroup = {
    id: number;
    name: string;
    habits?: Habit[];
    createdAt: Date;
    updatedAt: Date;
}

export type Habit = {
    id: number;
    habitsGroupId?: number;
    name: string;
    type: string;
    startDate: Date;
    isArchived: boolean;
    accentColor: string;
    icon: string;
    goalsValue: number;
    goalsPeriodicity: string;
    goalsUnit: string;
    goalsPeriodicityValues: string;
    createdAt: Date;
    updatedAt: Date;
    shareLink: string;
}

export type HabitWithProgress = {
    id: number;
    habitsGroupId?: number;
    name: string;
    type: string;
    startDate: Date;
    isArchived: boolean;
    accentColor: string;
    icon: string;
    goalsValue: number;
    goalsPeriodicity: string;
    goalsUnit: string;
    goalsPeriodicityValues: string;
    createdAt: Date;
    updatedAt: Date;
    shareLink: string;
    progress: Progress;
}

export type Progress = {
    id: number;
    habitId: number;
    value: number;
    createdAt: Date;
    updatedAt: Date;
}

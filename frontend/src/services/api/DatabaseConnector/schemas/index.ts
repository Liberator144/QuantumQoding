/**
 * Schema Definitions
 *
 * Defines schemas for the Unified Quantum Database.
 *
 * @version 1.0.0
 */
/**
 * Task schema
 */
const taskSchema = {
    id: { type: 'string', required: true },
    text: { type: 'string', required: true },
    status: { type: 'string', enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    level: {
        type: 'string',
        enum: ['main', 'phase', 'task', 'subtask', 'mini', 'micro'],
        required: true,
    },
    parent: { type: 'string', required: false },
    children: { type: 'array', items: { type: 'string' }, default: [] },
    explanation: { type: 'string', required: false },
    metadata: { type: 'object', required: false },
};
/**
 * Settings schema
 */
const settingsSchema = {
    theme: { type: 'string', enum: ['light', 'dark'], default: 'dark' },
    palette: { type: 'string', enum: ['quantum', 'cosmic', 'aurora', 'nebula'], default: 'quantum' },
    sidebar: { type: 'string', enum: ['expanded', 'collapsed'], default: 'expanded' },
    taskPanel: { type: 'string', enum: ['expanded', 'collapsed'], default: 'expanded' },
};
/**
 * Statistics schema
 */
const statisticsSchema = {
    totalTasks: { type: 'number', default: 0 },
    completedTasks: { type: 'number', default: 0 },
    inProgressTasks: { type: 'number', default: 0 },
    pendingTasks: { type: 'number', default: 0 },
    totalTime: { type: 'number', default: 0 },
    linesOfCode: { type: 'number', default: 0 },
    lastUpdated: { type: 'number', default: 0 },
};
/**
 * Query analytics schema
 */
const queryAnalyticsSchema = {
    id: { type: 'string', required: true },
    normalizedQueryString: { type: 'string', required: true },
    collectionName: { type: 'string', required: true },
    operationType: { type: 'string', required: true, enum: ['find', 'findOne', 'findById'] },
    timestamp: { type: 'number', required: true },
    durationMs: { type: 'number', required: true },
    resultCount: { type: 'number', required: true },
};
export { taskSchema, settingsSchema, statisticsSchema, queryAnalyticsSchema };

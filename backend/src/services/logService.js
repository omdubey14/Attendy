import { SystemLog } from "../models/SystemLog.js";

export const createLog = async ({ actor, action, targetType, targetId, details }) =>
  SystemLog.create({
    actor: actor || null,
    action,
    targetType,
    targetId,
    details,
  });

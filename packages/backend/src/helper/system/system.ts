import { ActivepiecesError, ErrorCode } from "../activepieces-error";
import { SystemProp } from "./system-prop";

export const system = {
  get(prop: SystemProp): string | undefined {
    return getEnvVar(prop);
  },

  getOrThrow(prop: SystemProp): string {
    const value = getEnvVar(prop);

    if (value === undefined) {
      throw new ActivepiecesError({
        code: ErrorCode.SYSTEM_PROP_NOT_DEFINED,
        params: {
          prop,
        },
      });
    }

    return value;
  },
};

const getEnvVar = (prop: SystemProp): string | undefined => {
  const value = process.env[`AP_${prop}`];
  console.log(`[system#getEnvVar] prop=${prop} value=${value}`);
  return value;
};

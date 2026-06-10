declare module "dotenv-expand" {
  export interface DotenvExpandInput {
    parsed?: Record<string, string>;
    processEnv?: NodeJS.ProcessEnv;
  }

  export interface DotenvExpandOutput {
    error?: Error;
    parsed?: Record<string, string>;
  }

  export function expand(config: DotenvExpandInput): DotenvExpandOutput;

  const dotenvExpand: {
    expand: typeof expand;
  };

  export default dotenvExpand;
}

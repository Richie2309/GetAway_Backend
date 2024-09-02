export default interface ICronJob {
  schedule: string;
  task: () => void;
  start(): void;
}

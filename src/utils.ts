export const delayTask = (task: () => void, seconds: number): void => {
  setTimeout(task, seconds * 1000);
};

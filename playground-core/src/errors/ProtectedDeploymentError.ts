export class ProtectedDeploymentError extends TypeError {
  constructor(deploymentName: string) {
    super(`${deploymentName} 배포는 삭제할 수 없습니다.`);
  }
}

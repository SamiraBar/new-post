pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "new-post-e2e-${BUILD_NUMBER}"
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('E2E Tests') {
      steps {
        script {
          sh '''
            echo "=== Running E2E tests ==="

            docker compose -f docker-compose.e2e.yml up \
              --build \
              --abort-on-container-exit \
              --exit-code-from e2e

            EXIT_CODE=$?

            docker compose -f docker-compose.e2e.yml down -v

            exit $EXIT_CODE
          '''
        }
      }
    }

    stage('Deploy Production') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        script {
          sh '''
            echo "=== Deploying production ==="

            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d --build
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline finished successfully'
    }
    failure {
      echo 'Pipeline failed (tests or deploy)'
    }
    always {
      sh 'docker system prune -f || true'
    }
  }
}

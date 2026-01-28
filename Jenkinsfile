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

    stage('Prepare test env') {
      steps {
        withCredentials([file(credentialsId: 'back-test-env', variable: 'TEST_ENV_FILE')]) {
          sh '''
            set -e
            mkdir -p back
            cp "$TEST_ENV_FILE" back/.test.env
            echo "Prepared back/.test.env"
          '''
        }
      }
    }

    stage('E2E Tests') {
      steps {
        sh '''
          set -e
          test -f back/.test.env

          echo "=== Running E2E tests ==="

          docker compose -p "$COMPOSE_PROJECT_NAME" -f docker-compose.e2e.yaml up \
            --build \
            --abort-on-container-exit \
            --exit-code-from e2e
        '''
      }
      post {
        always {
          sh '''
            echo "=== Cleaning E2E environment ==="
            docker compose -p "$COMPOSE_PROJECT_NAME" -f docker-compose.e2e.yaml down -v || true
          '''
        }
      }
    }

    stage('Deploy Production') {
      when {
        allOf {
          branch 'main'
          expression { currentBuild.currentResult == 'SUCCESS' }
        }
      }
      steps {
        sh '''
          set -e
          echo "=== Deploying production ==="

          docker compose -f docker-compose.prod.yaml pull
          docker compose -f docker-compose.prod.yaml up -d --build
        '''
      }
    }
  }

  post {
    success { echo 'Pipeline finished successfully' }
    failure { echo 'Pipeline failed (tests or deploy)' }
    always {
      sh '''
        docker system prune -f || true
      '''
    }
  }
}

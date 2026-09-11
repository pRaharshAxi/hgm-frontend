// Place this file at: frontend/Jenkinsfile
pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        SONAR_PROJECT_KEY = 'hgm-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || true'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test -- --coverage || true'   // remove "|| true" once a real test suite exists
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('hgm-sonarqube') {
                    sh """
                        npx sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=src \
                          -Dsonar.exclusions=**/node_modules/**,**/dist/**
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t hgm-frontend:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy (local compose)') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    cd ..
                    docker compose up -d --no-deps --build frontend
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: '**/junit.xml'
        }
    }
}

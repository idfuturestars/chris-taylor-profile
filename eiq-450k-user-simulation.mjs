#!/usr/bin/env node

/**
 * EiQ™ 450K User Simulation for ML Training Data Collection
 * Mandate: Half taking full assessment, half taking short version
 * All data stored as seed data for AI/ML training
 */

import fetch from 'node-fetch';
import fs from 'fs';
import { performance } from 'perf_hooks';

const BASE_URL = 'http://localhost:5000';
const TOTAL_USERS = 450000;
const BATCH_SIZE = 1000;
const CONCURRENT_REQUESTS = 50;

// Assessment configurations
const ASSESSMENT_TYPES = {
  FULL: {
    type: 'comprehensive',
    duration: 225, // 3h 45m in minutes
    questions: 260,
    domains: ['logical_reasoning', 'verbal_comprehension', 'spatial_intelligence', 'numerical_ability', 'pattern_recognition', 'emotional_intelligence']
  },
  SHORT: {
    type: 'baseline', 
    duration: 45, // 45 minutes
    questions: 60,
    domains: ['logical_reasoning', 'verbal_comprehension', 'spatial_intelligence', 'numerical_ability', 'pattern_recognition', 'emotional_intelligence']
  }
};

// Age groups for K-12 through adult
const AGE_GROUPS = [
  { range: '5-8', grade: 'K-2', category: 'elementary_early' },
  { range: '9-11', grade: '3-5', category: 'elementary_late' },
  { range: '12-14', grade: '6-8', category: 'middle_school' },
  { range: '15-18', grade: '9-12', category: 'high_school' },
  { range: '18-65', grade: 'adult', category: 'adult' }
];

// Education levels
const EDUCATION_LEVELS = ['elementary', 'middle_school', 'high_school', 'undergraduate', 'graduate', 'doctoral'];

// Global stats tracking
let stats = {
  totalUsers: 0,
  successfulRegistrations: 0,
  fullAssessments: 0,
  shortAssessments: 0,
  totalQuestions: 0,
  mlDataPoints: 0,
  errors: 0,
  startTime: performance.now(),
  avgResponseTime: 0,
  peakThroughput: 0,
  mlTrainingData: []
};

console.log('🧠 EiQ™ 450K User Simulation & ML Training Data Collection');
console.log('=========================================================');
console.log(`📊 Target: ${TOTAL_USERS.toLocaleString()} users`);
console.log(`🎯 Mandate: 50% full assessment, 50% short assessment`);
console.log(`🤖 Objective: Generate ML training seed data`);
console.log(`⚡ Concurrency: ${CONCURRENT_REQUESTS} requests`);
console.log(`📦 Batch size: ${BATCH_SIZE} users per batch`);
console.log('');

// Generate realistic user data
function generateUser(index) {
  const ageGroup = AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)];
  const firstName = generateRandomName();
  const lastName = generateRandomName();
  const assessmentType = index % 2 === 0 ? 'FULL' : 'SHORT'; // Exactly 50/50 split
  
  return {
    id: `eiq_user_${index}_${Date.now()}`,
    username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${index}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}@eiq-simulation.com`,
    firstName,
    lastName,
    ageGroup: ageGroup.range,
    gradeLevel: ageGroup.grade,
    category: ageGroup.category,
    educationLevel: EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)],
    assessmentType,
    preferredLearningStyle: ['visual', 'auditory', 'kinesthetic', 'reading'][Math.floor(Math.random() * 4)],
    timeAvailability: ['5-10 hours/week', '10-15 hours/week', '15-20 hours/week'][Math.floor(Math.random() * 3)]
  };
}

function generateRandomName() {
  const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Madison', 'Noah', 'Peyton', 'River', 'Sage', 'Skyler', 'Tatum'];
  return names[Math.floor(Math.random() * names.length)];
}

// Generate assessment responses with IRT-based scoring
function generateAssessmentData(user, assessmentConfig) {
  const responses = [];
  const domains = assessmentConfig.domains;
  const questionsPerDomain = Math.floor(assessmentConfig.questions / domains.length);
  
  let totalScore = 0;
  const domainScores = {};
  
  for (const domain of domains) {
    let domainScore = 0;
    const domainResponses = [];
    
    for (let q = 0; q < questionsPerDomain; q++) {
      // IRT-based response generation with difficulty adaptation
      const difficulty = Math.random() * 3; // 0-3 difficulty scale
      const userAbility = generateUserAbility(user);
      const probability = calculateIRTProbability(userAbility, difficulty);
      const isCorrect = Math.random() < probability;
      const responseTime = generateRealisticResponseTime(difficulty, isCorrect);
      
      const response = {
        questionId: `${domain}_q${q + 1}`,
        domain,
        difficulty: Math.round(difficulty * 100) / 100,
        userResponse: isCorrect ? 'correct' : generateIncorrectResponse(),
        correctAnswer: 'correct',
        isCorrect,
        responseTime,
        timestamp: Date.now() + (q * 30000), // 30 seconds average per question
        cognitiveLoad: difficulty * 0.8 + Math.random() * 0.4,
        confidence: isCorrect ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4
      };
      
      domainResponses.push(response);
      if (isCorrect) domainScore++;
    }
    
    // Calculate domain score as percentage
    const domainPercentage = (domainScore / questionsPerDomain) * 100;
    domainScores[domain] = Math.round(domainPercentage);
    totalScore += domainPercentage;
    responses.push(...domainResponses);
  }
  
  // Calculate overall EiQ score (weighted average)
  const eiqScore = Math.round((totalScore / domains.length) * 8); // Scale to ~800 point system
  
  return {
    userId: user.id,
    assessmentType: assessmentConfig.type,
    responses,
    domainScores,
    eiqScore,
    totalQuestions: responses.length,
    completionTime: assessmentConfig.duration,
    adaptiveAdjustments: Math.floor(Math.random() * 20), // Number of difficulty adjustments
    metadata: {
      userAge: user.ageGroup,
      gradeLevel: user.gradeLevel,
      educationLevel: user.educationLevel,
      learningStyle: user.preferredLearningStyle
    }
  };
}

function generateUserAbility(user) {
  // Generate ability based on age group and education level
  const baseAbility = {
    'elementary_early': -1.5 + Math.random() * 1.0,
    'elementary_late': -1.0 + Math.random() * 1.2,
    'middle_school': -0.5 + Math.random() * 1.5,
    'high_school': 0.0 + Math.random() * 2.0,
    'adult': 0.5 + Math.random() * 2.5
  };
  
  return baseAbility[user.category] || 0;
}

function calculateIRTProbability(ability, difficulty) {
  // 3-parameter logistic model for IRT
  const discrimination = 1.5; // Item discrimination parameter
  const guessing = 0.25; // Guessing parameter (25% chance)
  const exponential = Math.exp(discrimination * (ability - difficulty));
  return guessing + (1 - guessing) * (exponential / (1 + exponential));
}

function generateRealisticResponseTime(difficulty, isCorrect) {
  // Base time increases with difficulty, decreases if correct
  const baseTime = 15000 + (difficulty * 10000); // 15-45 seconds base
  const correctnessMultiplier = isCorrect ? 0.8 : 1.3; // Faster if correct
  const randomVariation = 0.7 + Math.random() * 0.6; // 70-130% variation
  return Math.round(baseTime * correctnessMultiplier * randomVariation);
}

function generateIncorrectResponse() {
  const incorrectTypes = ['wrong_option_a', 'wrong_option_b', 'wrong_option_c', 'no_response', 'partial_response'];
  return incorrectTypes[Math.floor(Math.random() * incorrectTypes.length)];
}

// Simulate user registration
async function registerUser(user) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ageGroup: user.ageGroup,
        gradeLevel: user.gradeLevel,
        educationLevel: user.educationLevel
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: 'Registration failed' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Simulate assessment completion
async function completeAssessment(user, token) {
  const assessmentConfig = ASSESSMENT_TYPES[user.assessmentType];
  const assessmentData = generateAssessmentData(user, assessmentConfig);
  
  try {
    // Submit assessment data
    const response = await fetch(`${BASE_URL}/api/assessments/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(assessmentData)
    });
    
    // Store as ML training data regardless of API response
    stats.mlTrainingData.push({
      userId: user.id,
      userProfile: {
        ageGroup: user.ageGroup,
        gradeLevel: user.gradeLevel,
        category: user.category,
        educationLevel: user.educationLevel,
        learningStyle: user.preferredLearningStyle
      },
      assessmentData,
      timestamp: Date.now(),
      sessionMetadata: {
        simulationBatch: Math.floor(stats.totalUsers / BATCH_SIZE),
        userIndex: stats.totalUsers,
        assessmentType: user.assessmentType
      }
    });
    
    // Update statistics
    stats.mlDataPoints += assessmentData.responses.length;
    stats.totalQuestions += assessmentData.totalQuestions;
    
    if (user.assessmentType === 'FULL') {
      stats.fullAssessments++;
    } else {
      stats.shortAssessments++;
    }
    
    return { success: true, eiqScore: assessmentData.eiqScore };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Process a batch of users concurrently
async function processBatch(batchUsers) {
  const startTime = performance.now();
  
  const promises = batchUsers.map(async (user) => {
    try {
      // Register user
      const registration = await registerUser(user);
      if (!registration.success) {
        stats.errors++;
        return { success: false, error: registration.error };
      }
      
      stats.successfulRegistrations++;
      
      // Complete assessment
      const assessment = await completeAssessment(user, registration.token);
      if (!assessment.success) {
        stats.errors++;
        return { success: false, error: assessment.error };
      }
      
      stats.totalUsers++;
      return { success: true, eiqScore: assessment.eiqScore };
    } catch (error) {
      stats.errors++;
      return { success: false, error: error.message };
    }
  });
  
  const results = await Promise.all(promises);
  const batchTime = performance.now() - startTime;
  const throughput = (batchUsers.length / batchTime) * 1000; // users per second
  
  if (throughput > stats.peakThroughput) {
    stats.peakThroughput = throughput;
  }
  
  return { results, batchTime, throughput };
}

// Save ML training data
function saveTrainingData() {
  const filename = `eiq-ml-training-data-${Date.now()}.json`;
  const trainingDataset = {
    metadata: {
      totalUsers: stats.totalUsers,
      totalQuestions: stats.totalQuestions,
      totalDataPoints: stats.mlDataPoints,
      fullAssessments: stats.fullAssessments,
      shortAssessments: stats.shortAssessments,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      platform: 'EiQ™ Powered by SikatLabs™'
    },
    cognitivedomains: ASSESSMENT_TYPES.FULL.domains,
    ageGroups: AGE_GROUPS,
    educationLevels: EDUCATION_LEVELS,
    trainingData: stats.mlTrainingData
  };
  
  fs.writeFileSync(filename, JSON.stringify(trainingDataset, null, 2));
  console.log(`💾 ML training data saved: ${filename}`);
  console.log(`📊 Dataset size: ${(fs.statSync(filename).size / 1024 / 1024).toFixed(2)} MB`);
  
  return filename;
}

// Progress reporting
function reportProgress(batchIndex, totalBatches, batchResults) {
  const progress = ((batchIndex + 1) / totalBatches * 100).toFixed(1);
  const elapsed = (performance.now() - stats.startTime) / 1000;
  const avgResponseTime = elapsed / stats.totalUsers * 1000;
  
  console.log(`📈 Batch ${batchIndex + 1}/${totalBatches} (${progress}%)`);
  console.log(`👥 Users processed: ${stats.totalUsers.toLocaleString()}/${TOTAL_USERS.toLocaleString()}`);
  console.log(`📝 Full assessments: ${stats.fullAssessments.toLocaleString()}`);
  console.log(`📄 Short assessments: ${stats.shortAssessments.toLocaleString()}`);
  console.log(`🧠 ML data points: ${stats.mlDataPoints.toLocaleString()}`);
  console.log(`⚡ Throughput: ${batchResults.throughput.toFixed(1)} users/sec`);
  console.log(`🕒 Avg response: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log('');
}

// Main simulation execution
async function runSimulation() {
  console.log('🚀 Starting 450K user simulation...\n');
  
  const totalBatches = Math.ceil(TOTAL_USERS / BATCH_SIZE);
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batchStart = batchIndex * BATCH_SIZE;
    const batchEnd = Math.min(batchStart + BATCH_SIZE, TOTAL_USERS);
    const batchUsers = [];
    
    // Generate batch users
    for (let i = batchStart; i < batchEnd; i++) {
      batchUsers.push(generateUser(i));
    }
    
    // Process batch
    const batchResults = await processBatch(batchUsers);
    
    // Report progress
    reportProgress(batchIndex, totalBatches, batchResults);
    
    // Save training data every 50 batches (50K users)
    if ((batchIndex + 1) % 50 === 0) {
      saveTrainingData();
      console.log(`💾 Checkpoint saved at ${stats.totalUsers.toLocaleString()} users\n`);
    }
  }
  
  // Final results
  const totalTime = (performance.now() - stats.startTime) / 1000;
  const overallThroughput = stats.totalUsers / totalTime;
  
  console.log('🎉 SIMULATION COMPLETED SUCCESSFULLY!');
  console.log('=====================================');
  console.log(`👥 Total users: ${stats.totalUsers.toLocaleString()}`);
  console.log(`✅ Successful registrations: ${stats.successfulRegistrations.toLocaleString()}`);
  console.log(`📝 Full assessments: ${stats.fullAssessments.toLocaleString()}`);
  console.log(`📄 Short assessments: ${stats.shortAssessments.toLocaleString()}`);
  console.log(`🧠 Total ML data points: ${stats.mlDataPoints.toLocaleString()}`);
  console.log(`📊 Total questions answered: ${stats.totalQuestions.toLocaleString()}`);
  console.log(`⏱️  Total time: ${(totalTime / 60).toFixed(1)} minutes`);
  console.log(`⚡ Overall throughput: ${overallThroughput.toFixed(1)} users/sec`);
  console.log(`🔥 Peak throughput: ${stats.peakThroughput.toFixed(1)} users/sec`);
  console.log(`❌ Error rate: ${(stats.errors / TOTAL_USERS * 100).toFixed(2)}%`);
  console.log('');
  
  // Save final training dataset
  const finalDatasetFile = saveTrainingData();
  
  console.log('🤖 ML TRAINING DATA READY');
  console.log('========================');
  console.log(`📁 Dataset file: ${finalDatasetFile}`);
  console.log(`📊 Data points per domain: ${(stats.mlDataPoints / 6).toLocaleString()}`);
  console.log(`🎯 Age group distribution: Balanced across K-12 + Adult`);
  console.log(`📈 Assessment split: 50% full (260q), 50% short (60q)`);
  console.log(`🧠 Ready for AI/ML training pipeline`);
  
  return {
    success: true,
    totalUsers: stats.totalUsers,
    mlDataPoints: stats.mlDataPoints,
    datasetFile: finalDatasetFile
  };
}

// Execute simulation
if (import.meta.url === new URL(import.meta.url).href) {
  runSimulation().catch(console.error);
}

export { runSimulation, stats };
/**
 * Duplicate Cleanup Script
 * Run this script to automatically scan and remove duplicate conversations
 */

import { scanAndRemoveDuplicates, findSimilarConversations, getConversations } from '../services/api';

/**
 * Main cleanup function
 */
export const runDuplicateCleanup = async () => {
  console.log('🧹 Starting Conversation Cleanup Process...');
  console.log('=====================================');
  
  try {
    // Step 1: Get current conversation count
    const initialConversations = await getConversations();
    console.log(`📊 Initial conversation count: ${initialConversations.length}`);
    
    // Step 2: Scan and remove exact duplicates
    console.log('\n🔍 Step 1: Scanning for exact duplicates...');
    const duplicateReport = await scanAndRemoveDuplicates();
    
    console.log('📋 Duplicate Scan Results:');
    console.log(`   • Total scanned: ${duplicateReport.totalScanned}`);
    console.log(`   • Duplicates found: ${duplicateReport.duplicatesFound}`);
    console.log(`   • Duplicates removed: ${duplicateReport.duplicatesRemoved}`);
    console.log(`   • Unique conversations remaining: ${duplicateReport.uniqueConversations}`);
    
    // Step 3: Show duplicate details if any
    if (duplicateReport.duplicateDetails.length > 0) {
      console.log('\n📝 Duplicate Details:');
      duplicateReport.duplicateDetails.forEach((detail, index) => {
        console.log(`   ${index + 1}. Removed: "${detail.duplicate.title}" (${detail.duplicate.topic})`);
        console.log(`      Kept: "${detail.original.title}" (${detail.original.topic})`);
      });
    }
    
    // Step 4: Find similar conversations
    console.log('\n🔍 Step 2: Finding similar conversations...');
    const similarGroups = await findSimilarConversations();
    
    if (similarGroups.length > 0) {
      console.log(`📋 Found ${similarGroups.length} groups of similar conversations:`);
      similarGroups.forEach((group, index) => {
        console.log(`   Group ${index + 1}: ${group.length} similar conversations`);
        group.forEach((conv, convIndex) => {
          console.log(`      ${convIndex + 1}. "${conv.title || 'Untitled'}" (${conv.topic || 'general'})`);
        });
      });
    } else {
      console.log('✅ No similar conversations found');
    }
    
    // Step 5: Final summary
    const finalConversations = await getConversations();
    console.log('\n🎉 Cleanup Complete!');
    console.log('==================');
    console.log(`📊 Before: ${initialConversations.length} conversations`);
    console.log(`📊 After: ${finalConversations.length} conversations`);
    console.log(`🗑️ Removed: ${initialConversations.length - finalConversations.length} duplicates`);
    
    return {
      success: true,
      initialCount: initialConversations.length,
      finalCount: finalConversations.length,
      removedCount: initialConversations.length - finalConversations.length,
      duplicateReport,
      similarGroups
    };
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Quick scan function (no removal, just reporting)
 */
export const quickScan = async () => {
  console.log('🔍 Quick Duplicate Scan (No Removal)...');
  
  try {
    const conversations = await getConversations();
    const duplicateMap = new Map();
    const duplicates = [];
    
    conversations.forEach(conv => {
      const content = [
        conv.title || '',
        conv.content || '',
        conv.lastUserMessage || '',
        conv.lastAIMessage || ''
      ].join('|').toLowerCase();
      
      // Simple hash
      let hash = 0;
      for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      const hashStr = hash.toString();
      
      if (duplicateMap.has(hashStr)) {
        duplicates.push({
          original: duplicateMap.get(hashStr),
          duplicate: conv
        });
      } else {
        duplicateMap.set(hashStr, conv);
      }
    });
    
    console.log(`📊 Total conversations: ${conversations.length}`);
    console.log(`🔍 Potential duplicates: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log('\n📝 Potential Duplicates:');
      duplicates.forEach((dup, index) => {
        console.log(`   ${index + 1}. "${dup.duplicate.title || 'Untitled'}" (ID: ${dup.duplicate.id})`);
        console.log(`      Similar to: "${dup.original.title || 'Untitled'}" (ID: ${dup.original.id})`);
      });
    }
    
    return {
      totalConversations: conversations.length,
      potentialDuplicates: duplicates.length,
      duplicates
    };
    
  } catch (error) {
    console.error('❌ Quick scan failed:', error);
    return { error: error.message };
  }
};

/**
 * Show conversation statistics by topic
 */
export const showTopicStats = async () => {
  try {
    const conversations = await getConversations();
    const topicStats = {};
    
    conversations.forEach(conv => {
      const topic = conv.topic || 'general';
      if (!topicStats[topic]) {
        topicStats[topic] = {
          count: 0,
          conversations: []
        };
      }
      topicStats[topic].count++;
      topicStats[topic].conversations.push(conv);
    });
    
    console.log('📊 Conversation Statistics by Topic:');
    console.log('===================================');
    
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const icon = {
        income: '💰',
        planner: '📅',
        weather: '🌤️',
        health: '🏥',
        work: '💼',
        personal: '👤',
        general: '💬'
      }[topic] || '📂';
      
      console.log(`${icon} ${topic.toUpperCase()}: ${stats.count} conversations`);
    });
    
    return topicStats;
    
  } catch (error) {
    console.error('❌ Failed to get topic stats:', error);
    return {};
  }
};

// Export all functions
export default {
  runDuplicateCleanup,
  quickScan,
  showTopicStats
};

/**
 * DSAbyHimanshu - Solved Problems Dataset
 * Contains ONLY the 3 problems solved by Himanshu:
 * - LC-1: Two Sum
 * - LC-217: Contains Duplicate
 * - LC-242: Valid Anagram
 *
 * Each problem includes:
 * - Line-by-line Code definitions (with beginner notes)
 * - Step-by-step active codeLine mapping
 * - Real-time variable state inspection
 * - First-timer comprehension explanations for complete beginners
 */

const DSA_PATTERNS = {
  "arrays-hashing": {
    id: "arrays-hashing",
    name: "Arrays & Hashing",
    icon: "📦",
    tagline: 'Pattern: "Have I seen this before? / Frequency Count"',
    punchline: "Remember what you've seen → O(n²) becomes O(n)",
    color: "#059669"
  }
};

const DSA_PROBLEMS = [
  // ==========================================
  // LC-1: Two Sum
  // ==========================================
  {
    id: "lc-1",
    lcNumber: 1,
    title: "Two Sum",
    difficulty: "Easy",
    patternId: "arrays-hashing",
    tags: ["Array", "Hash Table"],
    lcUrl: "https://leetcode.com/problems/two-sum/",
    prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    intuition: "Instead of checking every pair with a slow nested loop O(n²), store numbers we have already seen in a Hash Map. For each number x, instantly look up if (target - x) is in the map!",
    punchline: "Remember what you've seen → O(n²) becomes O(n)",
    defaultInput: { nums: [11, 15, 2, 7], target: 9 },
    presets: [
      { name: "From Sheet [11, 15, 2, 7], target=9", input: { nums: [11, 15, 2, 7], target: 9 } },
      { name: "Classic [2, 7, 11, 15], target=9", input: { nums: [2, 7, 11, 15], target: 9 } },
      { name: "Near End [3, 2, 4], target=6", input: { nums: [3, 2, 4], target: 6 } },
      { name: "Duplicates [3, 3], target=6", input: { nums: [3, 3], target: 6 } }
    ],

    bruteForce: {
      name: "Nested Loops (Pairwise Checks)",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation: "Iterate with pointer i from 0 to n-1, and pointer j from i+1 to n-1. Compute nums[i] + nums[j] for each pair until the sum matches target. Checks up to n(n-1)/2 pairs.",
      codeLines: [
        { line: 1, text: "def twoSum(nums, target):", note: "Function starts with array and target sum" },
        { line: 2, text: "    n = len(nums)", note: "Get number of elements" },
        { line: 3, text: "    for i in range(n):", note: "Outer loop: fix pointer i on first number" },
        { line: 4, text: "        for j in range(i + 1, n):", note: "Inner loop: test all remaining numbers j > i" },
        { line: 5, text: "            if nums[i] + nums[j] == target:", note: "Check if the two numbers add up to target" },
        { line: 6, text: "                return [i, j]", note: "Match found! Return the two indices" },
        { line: 7, text: "    return []", note: "No pair found after checking all combinations" }
      ],
      getSteps: (input) => {
        const { nums, target } = input;
        const steps = [];
        let checks = 0;

        steps.push({
          type: "init",
          i: -1,
          j: -1,
          checks: 0,
          codeLine: 1,
          vars: { i: "-", j: "-", "nums[i]": "-", "nums[j]": "-", sum: "-", target },
          firstTimerExplanation: `Begin Brute Force: We need to find two numbers that sum to ${target}. With no extra memory, the computer must test every single pair one by one.`,
          status: `Start brute force: checking all pairs (i, j) where j > i.`,
          nums: [...nums]
        });

        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            checks++;
            const sum = nums[i] + nums[j];
            const isMatch = sum === target;

            steps.push({
              type: isMatch ? "found" : "compare",
              i,
              j,
              checks,
              currentSum: sum,
              target,
              isMatch,
              codeLine: isMatch ? 6 : 5,
              vars: { i, j, "nums[i]": nums[i], "nums[j]": nums[j], sum, target, match: isMatch ? "YES 🎯" : "NO ❌" },
              firstTimerExplanation: isMatch
                ? `🎯 MATCH FOUND! nums[${i}] (${nums[i]}) + nums[${j}] (${nums[j]}) = ${sum}, which equals target ${target}! Line 6 returns [${i}, ${j}].`
                : `Testing pair: nums[${i}]=${nums[i]} and nums[${j}]=${nums[j]}. Sum is ${sum}. Does ${sum} == ${target}? No. Move pointer j forward.`,
              status: `Checking pair (nums[${i}]=${nums[i]}, nums[${j}]=${nums[j]}). Sum = ${nums[i]} + ${nums[j]} = ${sum}. ${isMatch ? `🎯 MATCH! Equals target ${target}!` : `❌ Not target.`}`,
              nums: [...nums]
            });

            if (isMatch) {
              steps.push({
                type: "done",
                i,
                j,
                checks,
                result: [i, j],
                codeLine: 6,
                vars: { result: `[${i}, ${j}]`, totalChecks: checks, verdict: "Solved" },
                firstTimerExplanation: `✅ Done! Returned [${i}, ${j}]. Notice how it took ${checks} total checks. On larger inputs of 10,000 numbers, this would take ~50,000,000 checks!`,
                status: `✅ Solved! Return indices [${i}, ${j}] after ${checks} pair checks.`,
                nums: [...nums]
              });
              return steps;
            }
          }
        }

        steps.push({
          type: "none",
          i: -1,
          j: -1,
          checks,
          codeLine: 7,
          vars: { result: "[]", totalChecks: checks },
          firstTimerExplanation: `Exhausted all ${checks} pair combinations without finding target ${target}. Line 7 returns empty list [].`,
          status: `Finished checking all ${checks} pairs. No pair found.`,
          nums: [...nums]
        });
        return steps;
      }
    },

    optimal: {
      name: "One-Pass Hash Map (Complement Lookup)",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Maintain a Hash Map mapping `value → index`. As we scan each number nums[i], calculate `complement = target - nums[i]`. If complement is already in the map, pair is found! Otherwise, store nums[i] → i.",
      codeLines: [
        { line: 1, text: "def twoSum(nums, target):", note: "Linear O(n) solution using Hash Map" },
        { line: 2, text: "    seen = {}  # value -> index", note: "Create empty dictionary to remember seen numbers" },
        { line: 3, text: "    for i, num in enumerate(nums):", note: "Single pass through the array (one loop only!)" },
        { line: 4, text: "        complement = target - num", note: "Calculate what partner number we need" },
        { line: 5, text: "        if complement in seen:", note: "Instant O(1) check: Did we already see the partner?" },
        { line: 6, text: "            return [seen[complement], i]", note: "Partner found in memory! Return both indices" },
        { line: 7, text: "        seen[num] = i", note: "Not seen: remember current number & its index in map" },
        { line: 8, text: "    return []", note: "No pair found after single pass" }
      ],
      getSteps: (input) => {
        const { nums, target } = input;
        const steps = [];
        const map = {};

        steps.push({
          type: "init",
          idx: -1,
          map: {},
          codeLine: 2,
          vars: { i: "-", num: "-", complement: "-", "seen": "{}" },
          firstTimerExplanation: `Begin Optimal: We initialize an empty Hash Map 'seen'. Instead of nested loops, we will check each number ONCE and look up its complement in O(1) time.`,
          status: `Initialize empty Hash Map seen = {}. Target = ${target}.`,
          nums: [...nums]
        });

        for (let i = 0; i < nums.length; i++) {
          const val = nums[i];
          const complement = target - val;
          const hasComplement = complement in map;

          steps.push({
            type: "lookup",
            idx: i,
            currentVal: val,
            complement,
            map: { ...map },
            found: hasComplement,
            codeLine: 5,
            vars: { i, num: val, complement: `${target} - ${val} = ${complement}`, "in seen?": hasComplement ? "YES ✅" : "NO ❌", "seen keys": Object.keys(map).join(", ") || "empty" },
            firstTimerExplanation: hasComplement
              ? `🎯 SUCCESS! We need ${complement}. We check our Hash Map: '${complement}' IS ALREADY IN SEEN at index ${map[complement]}! Line 6 immediately returns [${map[complement]}, ${i}].`
              : `At index ${i}, num = ${val}. To get ${target}, we need complement ${target} - ${val} = ${complement}. Line 5 checks if ${complement} is in seen: NO.`,
            status: `At index ${i}, num = ${val}. Need complement: ${target} - ${val} = ${complement}. Check map: ${hasComplement ? `✅ FOUND ${complement} at index ${map[complement]}!` : `❌ ${complement} not seen yet.`}`,
            nums: [...nums]
          });

          if (hasComplement) {
            steps.push({
              type: "done",
              idx: i,
              matchedIdx: map[complement],
              currentVal: val,
              complement,
              map: { ...map },
              result: [map[complement], i],
              codeLine: 6,
              vars: { result: `[${map[complement]}, ${i}]`, totalSteps: i + 1, verdict: "Solved in O(n)!" },
              firstTimerExplanation: `✅ Done in just ${i + 1} steps! By using a Hash Map as an instant memory lookup, we eliminated the slow inner loop completely.`,
              status: `✅ Pair found! Complement ${complement} (idx ${map[complement]}) + ${val} (idx ${i}) = ${target}. Return [${map[complement]}, ${i}].`,
              nums: [...nums]
            });
            return steps;
          }

          map[val] = i;
          steps.push({
            type: "insert",
            idx: i,
            insertedKey: val,
            insertedVal: i,
            map: { ...map },
            codeLine: 7,
            vars: { "store in map": `seen[${val}] = ${i}`, "seen map now": JSON.stringify(map) },
            firstTimerExplanation: `Line 7 stores seen[${val}] = ${i}. Now if any future number needs ${val}, it will find it instantly!`,
            status: `Store in Hash Map: seen[${val}] = ${i}. Continue to next element.`,
            nums: [...nums]
          });
        }

        steps.push({
          type: "none",
          idx: -1,
          map: { ...map },
          codeLine: 8,
          vars: { result: "[]" },
          firstTimerExplanation: "Scanned all elements in one pass. No complement pair sums to target.",
          status: "Scanned all elements. No pair found.",
          nums: [...nums]
        });
        return steps;
      }
    },

    code: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`
    },
    dryRunTable: [
      { step: "1", i: "0", num: "11", complement: "9 - 11 = -2", mapBefore: "{}", action: "Not in map → store 11:0", mapAfter: "{11: 0}" },
      { step: "2", i: "1", num: "15", complement: "9 - 15 = -6", mapBefore: "{11: 0}", action: "Not in map → store 15:1", mapAfter: "{11: 0, 15: 1}" },
      { step: "3", i: "2", num: "2", complement: "9 - 2 = 7", mapBefore: "{11: 0, 15: 1}", action: "Not in map → store 2:2", mapAfter: "{11: 0, 15: 1, 2: 2}" },
      { step: "4", i: "3", num: "7", complement: "9 - 7 = 2", mapBefore: "{11: 0, 15: 1, 2: 2}", action: "MATCH! 2 found at index 2", mapAfter: "Return [2, 3]" }
    ]
  },

  // ==========================================
  // LC-217: Contains Duplicate
  // ==========================================
  {
    id: "lc-217",
    lcNumber: 217,
    title: "Contains Duplicate",
    difficulty: "Easy",
    patternId: "arrays-hashing",
    tags: ["Array", "Hash Table", "Sorting"],
    lcUrl: "https://leetcode.com/problems/contains-duplicate/",
    prompt: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    intuition: "Instead of pairwise comparison O(n²), maintain a Hash Set of items seen so far. As soon as an element is already in the set, we immediately return true!",
    punchline: "Set lookup is O(1) → Detect repeats immediately on first sight",
    defaultInput: { nums: [1, 2, 3, 1] },
    presets: [
      { name: "From Sheet [1, 2, 3, 1]", input: { nums: [1, 2, 3, 1] } },
      { name: "All Unique [1, 2, 3, 4]", input: { nums: [1, 2, 3, 4] } },
      { name: "Multiple Dups [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]", input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] } }
    ],

    bruteForce: {
      name: "Pairwise Nested Comparison",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation: "Compare every element nums[i] with every subsequent element nums[j]. If any nums[i] == nums[j], return true. Worst case checks n(n-1)/2 pairs.",
      codeLines: [
        { line: 1, text: "def containsDuplicate(nums):", note: "Brute force checks all pairs for duplicates" },
        { line: 2, text: "    n = len(nums)", note: "Get length of array" },
        { line: 3, text: "    for i in range(n):", note: "Outer loop: pick element at index i" },
        { line: 4, text: "        for j in range(i + 1, n):", note: "Inner loop: compare with all elements j > i" },
        { line: 5, text: "            if nums[i] == nums[j]:", note: "Check if both values are identical" },
        { line: 6, text: "                return True", note: "Duplicate found! Exit and return True" },
        { line: 7, text: "    return False", note: "All pairs checked, no duplicates found" }
      ],
      getSteps: (input) => {
        const { nums } = input;
        const steps = [];
        let checks = 0;

        steps.push({
          type: "init",
          i: -1,
          j: -1,
          checks: 0,
          codeLine: 1,
          vars: { i: "-", j: "-", "nums[i]": "-", "nums[j]": "-" },
          firstTimerExplanation: "Begin Brute Force: We compare every pair (i, j). If any two numbers match, we return True.",
          status: "Start brute force nested check across all pairs.",
          nums: [...nums]
        });

        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            checks++;
            const isDup = nums[i] === nums[j];

            steps.push({
              type: isDup ? "found" : "compare",
              i,
              j,
              checks,
              isDup,
              codeLine: isDup ? 6 : 5,
              vars: { i, j, "nums[i]": nums[i], "nums[j]": nums[j], "nums[i] == nums[j]?": isDup ? "YES (Duplicate!)" : "NO" },
              firstTimerExplanation: isDup
                ? `🎯 DUPLICATE FOUND! nums[${i}] (${nums[i]}) == nums[${j}] (${nums[j]}). Line 6 immediately returns True!`
                : `Line 5 tests if nums[${i}]=${nums[i]} matches nums[${j}]=${nums[j]}. They don't match (${nums[i]} != ${nums[j]}). Move pointer j forward.`,
              status: `Checking (nums[${i}]=${nums[i]}, nums[${j}]=${nums[j]}). ${isDup ? `🎯 DUPLICATE FOUND: ${nums[i]} == ${nums[j]}!` : `Different (${nums[i]} != ${nums[j]}).`}`,
              nums: [...nums]
            });

            if (isDup) {
              steps.push({
                type: "done",
                hasDuplicate: true,
                checks,
                codeLine: 6,
                vars: { result: "True", checksCount: checks, verdict: "Duplicate Detected" },
                firstTimerExplanation: `✅ Done! Found duplicate ${nums[i]} after ${checks} checks. Return True.`,
                status: `✅ Return True! Found duplicate ${nums[i]} after ${checks} checks.`,
                nums: [...nums]
              });
              return steps;
            }
          }
        }

        steps.push({
          type: "done",
          hasDuplicate: false,
          checks,
          codeLine: 7,
          vars: { result: "False", checksCount: checks },
          firstTimerExplanation: `Checked all ${checks} pairs. Every element is distinct. Line 7 returns False.`,
          status: `Checked all ${checks} pairs. All elements are distinct. Return False.`,
          nums: [...nums]
        });
        return steps;
      }
    },

    optimal: {
      name: "Hash Set Membership",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Iterate through nums. For each number, check if it already exists in a Hash Set. If yes, duplicate found immediately. If no, insert it into the set. Completes in one pass.",
      codeLines: [
        { line: 1, text: "def containsDuplicate(nums):", note: "Optimal solution using Hash Set" },
        { line: 2, text: "    seen = set()", note: "Create an empty Hash Set for O(1) lookups" },
        { line: 3, text: "    for num in nums:", note: "Single pass through the numbers (O(n))" },
        { line: 4, text: "        if num in seen:", note: "Instant check: Have we already encountered this number?" },
        { line: 5, text: "            return True", note: "Duplicate detected! Exit immediately" },
        { line: 6, text: "        seen.add(num)", note: "Add number to set to remember for future elements" },
        { line: 7, text: "    return False", note: "No duplicates found in array" }
      ],
      getSteps: (input) => {
        const { nums } = input;
        const steps = [];
        const set = new Set();

        steps.push({
          type: "init",
          idx: -1,
          set: [],
          codeLine: 2,
          vars: { num: "-", "seen set": "{}" },
          firstTimerExplanation: "Begin Optimal: We initialize an empty Hash Set 'seen'. A set remembers elements and tells us if a number was seen in O(1) instant time.",
          status: "Initialize empty Hash Set seen = {}.",
          nums: [...nums]
        });

        for (let i = 0; i < nums.length; i++) {
          const val = nums[i];
          const alreadyInSet = set.has(val);

          steps.push({
            type: "check",
            idx: i,
            val,
            set: Array.from(set),
            alreadyInSet,
            codeLine: 4,
            vars: { i, num: val, "is in seen?": alreadyInSet ? "YES (Duplicate!)" : "NO", "seen set": `{${Array.from(set).join(", ")}}` || "empty" },
            firstTimerExplanation: alreadyInSet
              ? `🚨 DUPLICATE DETECTED! Line 4 checks if ${val} is in seen. YES, it was already stored! Line 5 returns True immediately!`
              : `At index ${i}, num = ${val}. Line 4 checks: Is ${val} already in seen? NO.`,
            status: `At index ${i}, val = ${val}. Is ${val} in set? ${alreadyInSet ? `🚨 YES! Duplicate detected!` : `❌ No, not seen yet.`}`,
            nums: [...nums]
          });

          if (alreadyInSet) {
            steps.push({
              type: "done",
              idx: i,
              val,
              hasDuplicate: true,
              set: Array.from(set),
              codeLine: 5,
              vars: { result: "True", verdict: `Duplicate ${val} found!`, totalSteps: i + 1 },
              firstTimerExplanation: `✅ Done! Found duplicate ${val} in just ${i + 1} steps. No slow nested loops needed!`,
              status: `✅ Return True! Duplicate ${val} seen again at index ${i}.`,
              nums: [...nums]
            });
            return steps;
          }

          set.add(val);
          steps.push({
            type: "insert",
            idx: i,
            val,
            set: Array.from(set),
            codeLine: 6,
            vars: { "action": `seen.add(${val})`, "seen set now": `{${Array.from(set).join(", ")}}` },
            firstTimerExplanation: `Line 6 adds ${val} to 'seen'. Now seen = {${Array.from(set).join(", ")}}. Next numbers can check against it.`,
            status: `Add ${val} to set: seen = {${Array.from(set).join(", ")}}.`,
            nums: [...nums]
          });
        }

        steps.push({
          type: "done",
          hasDuplicate: false,
          set: Array.from(set),
          codeLine: 7,
          vars: { result: "False", verdict: "All elements distinct" },
          firstTimerExplanation: "Completed single pass through array. No duplicate values were found. Line 7 returns False.",
          status: "Scanned entire array. No duplicates found. Return False.",
          nums: [...nums]
        });
        return steps;
      }
    },

    code: {
      python: `def containsDuplicate(nums: list[int]) -> bool:
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      javascript: `function containsDuplicate(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (!seen.add(num)) return true;
        }
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};`
    },
    dryRunTable: [
      { step: "1", i: "0", num: "1", inSet: "No", action: "Add 1 to set", setAfter: "{1}" },
      { step: "2", i: "1", num: "2", inSet: "No", action: "Add 2 to set", setAfter: "{1, 2}" },
      { step: "3", i: "2", num: "3", inSet: "No", action: "Add 3 to set", setAfter: "{1, 2, 3}" },
      { step: "4", i: "3", num: "1", inSet: "YES!", action: "1 already in set! Return True", setAfter: "{1, 2, 3}" }
    ]
  },

  // ==========================================
  // LC-242: Valid Anagram
  // ==========================================
  {
    id: "lc-242",
    lcNumber: 242,
    title: "Valid Anagram",
    difficulty: "Easy",
    patternId: "arrays-hashing",
    tags: ["Hash Table", "String", "Sorting"],
    lcUrl: "https://leetcode.com/problems/valid-anagram/",
    prompt: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.",
    intuition: "Instead of sorting both strings (O(n log n)) or searching & removing each letter (O(n²)), use a 26-slot frequency counter array. Increment counts for letters in s, and decrement for letters in t. If all slots end at 0, they are anagrams!",
    punchline: "Frequency balance: +1 for s, -1 for t → All 26 slots must equal 0",
    defaultInput: { s: "anagram", t: "nagaram" },
    presets: [
      { name: "From Sheet 'anagram' & 'nagaram'", input: { s: "anagram", t: "nagaram" } },
      { name: "Not Anagram 'rat' & 'car'", input: { s: "rat", t: "car" } },
      { name: "Different Length 'a' & 'ab'", input: { s: "a", t: "ab" } },
      { name: "Repeated 'listen' & 'silent'", input: { s: "listen", t: "silent" } }
    ],

    bruteForce: {
      name: "List Search & Remove / String Sort",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(n)",
      explanation: "Convert t into a mutable list of characters. For each character in s, scan through t to find and remove it. Each removal takes O(n) scan time, totaling O(n²).",
      codeLines: [
        { line: 1, text: "def isAnagram(s, t):", note: "Brute force search and remove" },
        { line: 2, text: "    if len(s) != len(t):", note: "Lengths must match to be anagrams" },
        { line: 3, text: "        return False", note: "Mismatch in length means not anagram" },
        { line: 4, text: "    t_list = list(t)", note: "Convert t to mutable list" },
        { line: 5, text: "    for char in s:", note: "For each character in s" },
        { line: 6, text: "        if char in t_list:", note: "Scan t_list O(n) to find character" },
        { line: 7, text: "            t_list.remove(char)", note: "Remove character from list" },
        { line: 8, text: "        else: return False", note: "Character not found -> Not anagram" },
        { line: 9, text: "    return len(t_list) == 0", note: "If all matched and removed, return True" }
      ],
      getSteps: (input) => {
        const { s, t } = input;
        const steps = [];
        if (s.length !== t.length) {
          return [
            {
              type: "init",
              s,
              t,
              codeLine: 3,
              vars: { "len(s)": s.length, "len(t)": t.length, match: "Length Mismatch" },
              firstTimerExplanation: `Length mismatch: len(s)=${s.length} != len(t)=${t.length}. Line 3 returns False immediately.`,
              status: `Length mismatch: len(s)=${s.length} != len(t)=${t.length}. Return False immediately.`
            }
          ];
        }

        let tList = t.split("");
        steps.push({
          type: "init",
          s,
          t,
          remaining: [...tList],
          codeLine: 4,
          vars: { s, t, "remaining in t": `[${tList.join(", ")}]` },
          firstTimerExplanation: `Begin Brute Force: Convert '${t}' into character list [${tList.join(", ")}]. For each letter in '${s}', we scan the entire list to find and remove it.`,
          status: `Initialize mutable list of characters from t: [${tList.join(", ")}]. Scan & remove each char of s.`
        });

        for (let i = 0; i < s.length; i++) {
          const char = s[i];
          const foundIdx = tList.indexOf(char);
          if (foundIdx === -1) {
            steps.push({
              type: "mismatch",
              char,
              remaining: [...tList],
              codeLine: 8,
              vars: { "current char": char, "found in t?": "NO", verdict: "Not Anagram" },
              firstTimerExplanation: `Char '${char}' from s was NOT found in remaining t! Line 8 returns False.`,
              status: `Char '${char}' from s was NOT found in remaining t! Return False.`
            });
            return steps;
          }
          tList.splice(foundIdx, 1);
          steps.push({
            type: "remove",
            char,
            foundIdx,
            remaining: [...tList],
            codeLine: 7,
            vars: { "char from s": char, "removed from t": char, "remaining t": `[${tList.join(", ")}]` || "empty" },
            firstTimerExplanation: `Found '${char}' in t list. Line 7 removes it. Notice that searching the list took O(n) scan time. Remaining in t: [${tList.join(", ")}].`,
            status: `Found '${char}' in t list → Removed. Remaining in t: [${tList.join(", ")}].`
          });
        }

        steps.push({
          type: "done",
          isAnagram: true,
          codeLine: 9,
          vars: { "remaining in t": "[]", result: "True", verdict: "Valid Anagram" },
          firstTimerExplanation: "✅ All letters in s were found and removed from t! The list is now empty. Line 9 returns True.",
          status: "✅ All letters matched and list is empty! Return True."
        });
        return steps;
      }
    },

    optimal: {
      name: "26-Slot Fixed Frequency Array",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) (fixed 26 integers)",
      explanation: "Use a fixed array of size 26. In one loop, increment count for `s[i]` and decrement count for `t[i]`. Finally, check if every slot is 0. Constant O(1) space and linear O(n) time.",
      codeLines: [
        { line: 1, text: "def isAnagram(s: str, t: str) -> bool:", note: "Optimal 26-slot frequency counter" },
        { line: 2, text: "    if len(s) != len(t):", note: "Lengths must match to be an anagram" },
        { line: 3, text: "        return False", note: "Quick exit if string lengths differ" },
        { line: 4, text: "    counts = [0] * 26  # 26 alphabet slots", note: "Fixed array for letters a through z" },
        { line: 5, text: "    for i in range(len(s)):", note: "Single pass over both strings together" },
        { line: 6, text: "        counts[ord(s[i]) - ord('a')] += 1", note: "+1 for character from string s" },
        { line: 7, text: "        counts[ord(t[i]) - ord('a')] -= 1", note: "-1 for character from string t" },
        { line: 8, text: "    return all(c == 0 for c in counts)", note: "If every slot balances to 0 -> True!" }
      ],
      getSteps: (input) => {
        const { s, t } = input;
        const steps = [];
        if (s.length !== t.length) {
          return [
            {
              type: "init",
              codeLine: 3,
              vars: { "len(s)": s.length, "len(t)": t.length },
              firstTimerExplanation: `Length mismatch: s.length (${s.length}) != t.length (${t.length}) → Line 3 returns False.`,
              status: `Length mismatch: s.length (${s.length}) != t.length (${t.length}) → Return False.`
            }
          ];
        }

        const counts = new Array(26).fill(0);
        steps.push({
          type: "init",
          counts: [...counts],
          codeLine: 4,
          vars: { s, t, slots: "26 slots all 0" },
          firstTimerExplanation: "Begin Optimal: Initialize 26 integer slots (a=0, b=1, ... z=25) all set to 0. For each position, we add +1 for s[i] and subtract -1 for t[i].",
          status: "Initialize 26-slot frequency array with all 0s."
        });

        for (let i = 0; i < s.length; i++) {
          const charS = s[i];
          const charT = t[i];
          const idxS = charS.charCodeAt(0) - 97;
          const idxT = charT.charCodeAt(0) - 97;
          counts[idxS]++;
          counts[idxT]--;

          steps.push({
            type: "update",
            stepIdx: i,
            charS,
            charT,
            counts: [...counts],
            codeLine: 6,
            vars: { i, "from s": `+1 for '${charS}'`, "from t": `-1 for '${charT}'`, "net balance": `slot[${charS}]=${counts[idxS]}, slot[${charT}]=${counts[idxT]}` },
            firstTimerExplanation: `Position ${i}: s has '${charS}' (Line 6: counts[${idxS}] += 1). t has '${charT}' (Line 7: counts[${idxT}] -= 1).`,
            status: `Step ${i + 1}: From s: '+${charS}', from t: '-${charT}'. Slot counts updated.`
          });
        }

        const allZero = counts.every(c => c === 0);
        steps.push({
          type: "done",
          isAnagram: allZero,
          counts: [...counts],
          codeLine: 8,
          vars: { "all slots zero?": allZero ? "YES (Balanced)" : "NO", result: allZero ? "True" : "False" },
          firstTimerExplanation: allZero
            ? "✅ Line 8 checks: Every single slot in counts is 0! All letter frequencies match perfectly. Return True in O(n) time!"
            : "❌ Line 8 checks: Non-zero slot found! One string had extra letters. Return False.",
          status: allZero
            ? "✅ Every slot is 0! Counts perfectly balanced. Return True."
            : "❌ Non-zero slot found! Frequencies do not match. Return False."
        });
        return steps;
      }
    },

    code: {
      python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for i in range(len(s)):
        counts[ord(s[i]) - ord('a')] += 1
        counts[ord(t[i]) - ord('a')] -= 1
    return all(c == 0 for c in counts)`,
      javascript: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const counts = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        counts[s.charCodeAt(i) - 97]++;
        counts[t.charCodeAt(i) - 97]--;
    }
    return counts.every(c => c === 0);
}`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] counts = new int[26];
        for (int i = 0; i < s.length(); i++) {
            counts[s.charAt(i) - 'a']++;
            counts[t.charAt(i) - 'a']--;
        }
        for (int c : counts) {
            if (c != 0) return false;
        }
        return true;
    }
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        vector<int> counts(26, 0);
        for (int i = 0; i < s.size(); i++) {
            counts[s[i] - 'a']++;
            counts[t[i] - 'a']--;
        }
        for (int c : counts) {
            if (c != 0) return false;
        }
        return true;
    }
};`
    },
    dryRunTable: [
      { step: "1", charS: "'a' (+1)", charT: "'n' (-1)", netChange: "a: +1, n: -1" },
      { step: "2", charS: "'n' (+1)", charT: "'a' (-1)", netChange: "a: 0, n: 0" },
      { step: "3", charS: "'a' (+1)", charT: "'g' (-1)", netChange: "a: +1, g: -1" },
      { step: "4", charS: "'g' (+1)", charT: "'a' (-1)", netChange: "a: 0, g: 0" },
      { step: "5", charS: "'r' (+1)", charT: "'r' (-1)", netChange: "r: 0" },
      { step: "6", charS: "'a' (+1)", charT: "'a' (-1)", netChange: "a: 0" },
      { step: "7", charS: "'m' (+1)", charT: "'m' (-1)", netChange: "m: 0 → All slots = 0 ✓" }
    ]
  }
,

  // ==========================================
  // LC-49: Group Anagrams
  // ==========================================
  {
    id: "lc-49",
    lcNumber: 49,
    title: "Group Anagrams",
    difficulty: "Medium",
    patternId: "arrays-hashing",
    tags: ["Array", "Hash Table", "String", "Sorting"],
    lcUrl: "https://leetcode.com/problems/group-anagrams/",
    prompt: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    intuition: "Anagrams contain the exact same characters in different orders. If we sort each word alphabetically (e.g., 'eat' -> 'aet', 'tea' -> 'aet'), all anagrams produce the exact same signature key! Use this sorted signature as a Hash Map key to group words together in a single pass.",
    punchline: "Sort each word into a common signature key -> O(n * k log k) single-pass grouping",
    defaultInput: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] },
    presets: [
      { name: 'Standard ["eat", "tea", "tan", "ate", "nat", "bat"]', input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] } },
      { name: 'Empty string [""]', input: { strs: [""] } },
      { name: 'Single char ["a"]', input: { strs: ["a"] } },
      { name: 'Pairs ["ab", "ba", "xy", "yx"]', input: { strs: ["ab", "ba", "xy", "yx"] } }
    ],

    bruteForce: {
      name: "Nested Pairwise Comparison",
      timeComplexity: "O(n² · k log k)",
      spaceComplexity: "O(n · k)",
      explanation: "Maintain a list of groups. For each incoming string, compare it against the representative of each existing group by sorting both strings. If they match, add to that group; otherwise start a new group.",
      codeLines: [
        { line: 1, text: "def groupAnagrams(strs):", note: "Brute force grouping by comparing each word with existing groups" },
        { line: 2, text: "    groups = []  # list of groups", note: "Initialize empty list of anagram groups" },
        { line: 3, text: "    for word in strs:", note: "Iterate through each word in the input list" },
        { line: 4, text: "        found = False", note: "Track if current word matched an existing group" },
        { line: 5, text: "        for group in groups:", note: "Compare against every existing group" },
        { line: 6, text: "            if sorted(word) == sorted(group[0]):", note: "Sort both words to test if they are anagrams" },
        { line: 7, text: "                group.append(word); found = True; break", note: "Match found: append to group and stop searching" },
        { line: 8, text: "        if not found: groups.append([word])", note: "No group matched: start a brand new group" },
        { line: 9, text: "    return groups", note: "Return final nested list of grouped words" }
      ],
      getSteps: (input) => {
        const strs = input.strs || [];
        const steps = [];
        const groups = [];

        steps.push({
          type: "init",
          codeLine: 1,
          groups: [],
          word: "-",
          vars: { word: "-", totalGroups: 0, checked: 0 },
          firstTimerExplanation: "Start Brute Force: We check each word against all existing groups one-by-one by sorting them. No hash map is used, so it repeatedly compares words.",
          status: "Initialize empty groups list."
        });

        for (let i = 0; i < strs.length; i++) {
          const w = strs[i];
          const sortedW = w.split("").sort().join("");
          let found = false;

          for (let gIdx = 0; gIdx < groups.length; gIdx++) {
            const firstSorted = groups[gIdx][0].split("").sort().join("");
            const isMatch = sortedW === firstSorted;

            steps.push({
              type: "compare",
              codeLine: 6,
              word: w,
              groupIndex: gIdx,
              groups: groups.map(g => [...g]),
              vars: { word: `"${w}"`, candidateGroup: `[${groups[gIdx].join(", ")}]`, sortedWord: `"${sortedW}"`, sortedGroupLeader: `"${firstSorted}"`, match: isMatch ? "YES" : "NO" },
              firstTimerExplanation: `Comparing "${w}" (sorted: "${sortedW}") with group #${gIdx + 1} leader "${groups[gIdx][0]}" (sorted: "${firstSorted}"). ${isMatch ? "They match!" : "No match, check next group."}`,
              status: `Comparing "${w}" with group #${gIdx + 1} (${groups[gIdx][0]}).`
            });

            if (isMatch) {
              groups[gIdx].push(w);
              found = true;
              steps.push({
                type: "append",
                codeLine: 7,
                word: w,
                groupIndex: gIdx,
                groups: groups.map(g => [...g]),
                vars: { word: `"${w}"`, addedToGroup: gIdx, groupNow: `[${groups[gIdx].join(", ")}]` },
                firstTimerExplanation: `Added "${w}" into existing group #${gIdx + 1}!`,
                status: `Matched! Added "${w}" to group #${gIdx + 1}.`
              });
              break;
            }
          }

          if (!found) {
            groups.push([w]);
            steps.push({
              type: "new_group",
              codeLine: 8,
              word: w,
              groups: groups.map(g => [...g]),
              vars: { word: `"${w}"`, newGroupIndex: groups.length - 1, totalGroups: groups.length },
              firstTimerExplanation: `No existing group matched "${w}". Started new group #${groups.length}: ["${w}"].`,
              status: `Created new group for "${w}". Total groups: ${groups.length}.`
            });
          }
        }

        steps.push({
          type: "done",
          codeLine: 9,
          groups: groups.map(g => [...g]),
          vars: { totalGroups: groups.length, verdict: "Completed" },
          firstTimerExplanation: `Finished grouping all ${strs.length} words into ${groups.length} distinct anagram families!`,
          status: `Done! Grouped ${strs.length} words into ${groups.length} groups.`
        });

        return steps;
      }
    },

    optimal: {
      name: "One-Pass Signature Hash Map",
      timeComplexity: "O(n · k log k)",
      spaceComplexity: "O(n · k)",
      explanation: "For each string, sort its characters to generate a canonical signature key (e.g. 'eat' -> 'aet'). Use a Hash Map `signature -> [words]`. In one pass, each word instantly maps to its bucket in O(1) time.",
      codeLines: [
        { line: 1, text: "def groupAnagrams(strs):", note: "Optimal O(n · k log k) single-pass using Hash Map" },
        { line: 2, text: "    ans = collections.defaultdict(list)", note: "Initialize hash map where keys map to lists of words" },
        { line: 3, text: "    for s in strs:", note: "Single loop: process each string in the array" },
        { line: 4, text: "        key = tuple(sorted(s))", note: "Sort characters into canonical signature key" },
        { line: 5, text: "        ans[key].append(s)", note: "Instant O(1) bucket insertion into hash map" },
        { line: 6, text: "    return list(ans.values())", note: "Return all bucket groups as a list" }
      ],
      getSteps: (input) => {
        const strs = input.strs || [];
        const steps = [];
        const map = {};

        steps.push({
          type: "init",
          codeLine: 1,
          map: {},
          vars: { mapSize: 0, currentWord: "-" },
          firstTimerExplanation: "Start Optimal: We create an empty Hash Map `ans`. For every word, we sort its characters to form a unique key, and insert it directly into the map in O(1) time.",
          status: "Initialize empty Hash Map."
        });

        for (let i = 0; i < strs.length; i++) {
          const s = strs[i];
          const key = s.split("").sort().join("");

          steps.push({
            type: "compute_key",
            codeLine: 4,
            currentWord: s,
            key,
            map: JSON.parse(JSON.stringify(map)),
            vars: { word: `"${s}"`, sortedKey: `"${key}"` },
            firstTimerExplanation: `Read word "${s}". Sorted characters: "${key}". This key uniquely identifies all anagrams of "${s}".`,
            status: `Compute key for "${s}": sorted -> "${key}".`
          });

          if (!map[key]) map[key] = [];
          map[key].push(s);

          steps.push({
            type: "insert",
            codeLine: 5,
            currentWord: s,
            key,
            map: JSON.parse(JSON.stringify(map)),
            vars: { word: `"${s}"`, key: `"${key}"`, bucket: `[${map[key].join(", ")}]` },
            firstTimerExplanation: `Inserted "${s}" into bucket for key "${key}". Bucket now contains: [${map[key].join(", ")}].`,
            status: `Mapped "${s}" -> key "${key}".`
          });
        }

        steps.push({
          type: "done",
          codeLine: 6,
          map: JSON.parse(JSON.stringify(map)),
          vars: { totalBuckets: Object.keys(map).length, totalWords: strs.length, verdict: "Solved" },
          firstTimerExplanation: `All words processed! Extracting values from Hash Map: ${Object.keys(map).length} grouped lists.`,
          status: `Complete! Return all ${Object.keys(map).length} anagram groups.`
        });

        return steps;
      }
    },

    code: {
      python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        ans = collections.defaultdict(list)
        for s in strs:
            ans[tuple(sorted(s))].append(s)
        return list(ans.values())`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> map;
        for (string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            map[key].push_back(s);
        }
        vector<vector<string>> ans;
        for (auto& pair : map) {
            ans.push_back(pair.second);
        }
        return ans;
    }
};`
    },
    dryRunTable: [
      { step: "1", word: '"eat"', key: '"aet"', mapBucket: '["eat"]' },
      { step: "2", word: '"tea"', key: '"aet"', mapBucket: '["eat", "tea"]' },
      { step: "3", word: '"tan"', key: '"ant"', mapBucket: '["tan"]' },
      { step: "4", word: '"ate"', key: '"aet"', mapBucket: '["eat", "tea", "ate"]' },
      { step: "5", word: '"nat"', key: '"ant"', mapBucket: '["tan", "nat"]' },
      { step: "6", word: '"bat"', key: '"abt"', mapBucket: '["bat"]' }
    ]
  },
,

  // ==========================================
  // LC-128: Longest Consecutive Sequence
  // ==========================================
  {
    id: "lc-128",
    lcNumber: 128,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    patternId: "arrays-hashing",
    tags: ["Array", "Hash Table", "Union Find"],
    lcUrl: "https://leetcode.com/problems/longest-consecutive-sequence/",
    prompt: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    intuition: "Put all numbers in a Hash Set for instant O(1) lookups. To achieve linear O(n) time without sorting, only start counting a streak from a number x if (x - 1) is NOT in the set! That proves x is the beginning of a streak. We then count x + 1, x + 2, ... Each number is visited at most twice.",
    punchline: "Only build sequences starting from the streak root (x - 1 not in set) -> O(n) linear time",
    defaultInput: { nums: [100, 4, 200, 1, 3, 2] },
    presets: [
      { name: "Classic [100, 4, 200, 1, 3, 2]", input: { nums: [100, 4, 200, 1, 3, 2] } },
      { name: "Long Run [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]", input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] } },
      { name: "Single [1]", input: { nums: [1] } },
      { name: "Empty []", input: { nums: [] } }
    ],

    bruteForce: {
      name: "Repeated Linear Search",
      timeComplexity: "O(n³)",
      spaceComplexity: "O(1)",
      explanation: "For each number x in the array, iteratively search if x+1, x+2, ... exists in the array using linear search. Each element check scans the entire array O(n), repeating for each streak.",
      codeLines: [
        { line: 1, text: "def longestConsecutive(nums):", note: "Brute force search without extra space" },
        { line: 2, text: "    longest = 0", note: "Track max streak length found" },
        { line: 3, text: "    for num in nums:", note: "Check every number as potential streak start" },
        { line: 4, text: "        current_num = num; streak = 1", note: "Start current streak count at 1" },
        { line: 5, text: "        while (current_num + 1) in nums:", note: "Linear scan: search entire array for next number" },
        { line: 6, text: "            current_num += 1; streak += 1", note: "Found next number: extend streak" },
        { line: 7, text: "        longest = max(longest, streak)", note: "Update global maximum streak" },
        { line: 8, text: "    return longest", note: "Return maximum consecutive length" }
      ],
      getSteps: (input) => {
        const nums = input.nums || [];
        const steps = [];
        let longest = 0;

        steps.push({
          type: "init",
          codeLine: 1,
          nums: [...nums],
          longest: 0,
          vars: { longest: 0, currentNum: "-", streak: 0 },
          firstTimerExplanation: "Start Brute Force: For each number in the array, we do a linear search to see if num+1, num+2... exist in the array. This scans the array repeatedly.",
          status: "Initialize brute force search."
        });

        if (nums.length === 0) {
          steps.push({ type: "done", codeLine: 8, nums: [], longest: 0, vars: { longest: 0, verdict: "Empty array" }, firstTimerExplanation: "Array is empty, streak is 0.", status: "Empty input -> 0" });
          return steps;
        }

        for (let i = 0; i < nums.length; i++) {
          const num = nums[i];
          let currentNum = num;
          let streak = 1;

          steps.push({
            type: "start_streak",
            codeLine: 4,
            currentNum,
            streak,
            longest,
            activeIdx: i,
            nums: [...nums],
            vars: { currentNum, streak, longest },
            firstTimerExplanation: `Testing number ${num} at index ${i}. Starting streak count = 1.`,
            status: `Start testing streak from ${num}.`
          });

          while (nums.includes(currentNum + 1)) {
            currentNum += 1;
            streak += 1;
            steps.push({
              type: "extend",
              codeLine: 6,
              currentNum,
              streak,
              longest,
              activeIdx: i,
              nums: [...nums],
              vars: { foundNext: currentNum, streak, longest },
              firstTimerExplanation: `Found ${currentNum} in array! Streak extended to ${streak}.`,
              status: `Found consecutive number ${currentNum}. Streak is now ${streak}.`
            });
          }

          longest = Math.max(longest, streak);
          steps.push({
            type: "update_max",
            codeLine: 7,
            currentNum,
            streak,
            longest,
            activeIdx: i,
            nums: [...nums],
            vars: { testedNum: num, streak, longest },
            firstTimerExplanation: `${currentNum + 1} not in array. Streak ended at length ${streak}. Max longest so far = ${longest}.`,
            status: `Streak from ${num} ended at ${streak}. Max longest = ${longest}.`
          });
        }

        steps.push({
          type: "done",
          codeLine: 8,
          longest,
          nums: [...nums],
          vars: { longest, totalElements: nums.length, verdict: "Completed" },
          firstTimerExplanation: `Finished checking all numbers. Longest consecutive sequence length = ${longest}!`,
          status: `Complete! Longest sequence length is ${longest}.`
        });

        return steps;
      }
    },

    optimal: {
      name: "Hash Set Intelligent Sequence Starter",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      explanation: "Add all numbers to a Hash Set. Iterate through numbers, but only start building a sequence from `num` if `num - 1` is NOT in the set! This guarantees we only start from sequence roots. Then step forward while `num + streak` is in set.",
      codeLines: [
        { line: 1, text: "def longestConsecutive(nums):", note: "O(n) linear solution using Hash Set lookup" },
        { line: 2, text: "    num_set = set(nums)", note: "Load all numbers into set for instant O(1) membership checks" },
        { line: 3, text: "    longest = 0", note: "Initialize longest sequence length" },
        { line: 4, text: "    for n in num_set:", note: "Iterate over unique numbers" },
        { line: 5, text: "        if (n - 1) not in num_set:", note: "Key check: is this the start of a sequence?" },
        { line: 6, text: "            length = 1", note: "Yes! Start new streak of length 1" },
        { line: 7, text: "            while (n + length) in num_set:", note: "Follow the consecutive chain forward in O(1) steps" },
        { line: 8, text: "                length += 1", note: "Increment streak length" },
        { line: 9, text: "            longest = max(longest, length)", note: "Update global longest streak" },
        { line: 10, text: "    return longest", note: "Return maximum length found" }
      ],
      getSteps: (input) => {
        const nums = input.nums || [];
        const steps = [];
        const numSet = new Set(nums);
        const setArray = Array.from(numSet);
        let longest = 0;

        steps.push({
          type: "init",
          codeLine: 2,
          setArray: [...setArray],
          longest: 0,
          vars: { setSize: setArray.length, longest: 0 },
          firstTimerExplanation: `Loaded all ${nums.length} numbers into a Hash Set: {${setArray.join(", ")}}. Now all lookups are instant O(1)!`,
          status: `Loaded ${setArray.length} unique numbers into Hash Set.`
        });

        for (let i = 0; i < setArray.length; i++) {
          const n = setArray[i];
          const hasPredecessor = numSet.has(n - 1);

          if (hasPredecessor) {
            steps.push({
              type: "skip",
              codeLine: 5,
              currentNum: n,
              hasPredecessor: true,
              setArray: [...setArray],
              longest,
              vars: { n, "n - 1": n - 1, isStart: "NO ⏩ (Skip)", longest },
              firstTimerExplanation: `Checking ${n}: Is ${n - 1} in set? YES! That means ${n} is part of a streak starting earlier. Skip it in O(1) to avoid redundant work!`,
              status: `Skip ${n} because ${n - 1} exists in set.`
            });
            continue;
          }

          // n is the start of a streak
          let length = 1;
          const streakChain = [n];

          steps.push({
            type: "start_root",
            codeLine: 6,
            currentNum: n,
            hasPredecessor: false,
            setArray: [...setArray],
            streakChain: [...streakChain],
            length,
            longest,
            vars: { n, "n - 1": n - 1, isStart: "YES 🚀 (Streak Root!)", length, longest },
            firstTimerExplanation: `Checking ${n}: Is ${n - 1} in set? NO! This is the beginning of a sequence! Starting streak at ${n}.`,
            status: `${n} is a sequence root! Start streak.`
          });

          while (numSet.has(n + length)) {
            streakChain.push(n + length);
            length += 1;

            steps.push({
              type: "chain_extend",
              codeLine: 8,
              currentNum: n,
              streakChain: [...streakChain],
              length,
              longest,
              setArray: [...setArray],
              vars: { nextNum: n + length - 1, currentChain: `[${streakChain.join(" -> ")}]`, length, longest },
              firstTimerExplanation: `Found ${n + length - 1} in set! Chain is now [${streakChain.join(" -> ")}] (length ${length}).`,
              status: `Chain extended: ${streakChain.join(" -> ")} (length ${length}).`
            });
          }

          longest = Math.max(longest, length);
          steps.push({
            type: "update_longest",
            codeLine: 9,
            currentNum: n,
            streakChain: [...streakChain],
            length,
            longest,
            setArray: [...setArray],
            vars: { chain: `[${streakChain.join(" -> ")}]`, length, longest },
            firstTimerExplanation: `Sequence [${streakChain.join(" -> ")}] ended at length ${length}. Longest updated to ${longest}!`,
            status: `Sequence completed: length ${length}. Max longest = ${longest}.`
          });
        }

        steps.push({
          type: "done",
          codeLine: 10,
          longest,
          setArray: [...setArray],
          vars: { longest, verdict: "Solved" },
          firstTimerExplanation: `Optimal pass complete! Total linear time O(n) because each number is only part of one forward streak expansion. Final answer = ${longest}!`,
          status: `Complete! Return longest consecutive streak length = ${longest}.`
        });

        return steps;
      }
    },

    code: {
      python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        num_set = set(nums)
        longest = 0
        for n in num_set:
            # check if it's the start of a sequence
            if (n - 1) not in num_set:
                length = 1
                while (n + length) in num_set:
                    length += 1
                longest = max(longest, length)
        return longest`,
      java: `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) set.add(num);
        int longest = 0;
        for (int n : set) {
            if (!set.contains(n - 1)) {
                int length = 1;
                while (set.contains(n + length)) {
                    length++;
                }
                longest = Math.max(longest, length);
            }
        }
        return longest;
    }
}`,
      cpp: `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> set(nums.begin(), nums.end());
        int longest = 0;
        for (int n : set) {
            if (!set.count(n - 1)) {
                int length = 1;
                while (set.count(n + length)) {
                    length++;
                }
                longest = max(longest, length);
            }
        }
        return longest;
    }
};`
    },
    dryRunTable: [
      { num: "100", hasPredecessor: "99 in set? NO", action: "Check 101: NO -> Streak: 1", longest: "1" },
      { num: "4", hasPredecessor: "3 in set? YES", action: "Skip ⏩ (Not root)", longest: "1" },
      { num: "200", hasPredecessor: "199 in set? NO", action: "Check 201: NO -> Streak: 1", longest: "1" },
      { num: "1", hasPredecessor: "0 in set? NO", action: "Check 2,3,4: YES -> Chain [1,2,3,4]: length 4", longest: "4 🎯" },
      { num: "3", hasPredecessor: "2 in set? YES", action: "Skip ⏩ (Not root)", longest: "4" },
      { num: "2", hasPredecessor: "1 in set? YES", action: "Skip ⏩ (Not root)", longest: "4" }
    ]
  },

  // ==========================================
  // LC-238: Product of Array Except Self
  // ==========================================
  {
    id: "lc-238",
    lcNumber: 238,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    patternId: "arrays-hashing",
    tags: ["Array", "Prefix Sum"],
    lcUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    prompt: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operation.",
    intuition: "For any index i, the answer is (product of all numbers to the left of i) * (product of all numbers to the right of i). In pass 1, compute prefix products moving left-to-right. In pass 2, maintain a running suffix product moving right-to-left. No division needed!",
    punchline: "Prefix Product * Suffix Product = Product Except Self -> O(n) time, O(1) extra space",
    defaultInput: { nums: [1, 2, 3, 4] },
    presets: [
      { name: "Classic [1, 2, 3, 4]", input: { nums: [1, 2, 3, 4] } },
      { name: "With Zero [-1, 1, 0, -3, 3]", input: { nums: [-1, 1, 0, -3, 3] } },
      { name: "Two elements [2, 3]", input: { nums: [2, 3] } },
      { name: "Negative [-1, -2, -3, -4]", input: { nums: [-1, -2, -3, -4] } }
    ],

    bruteForce: {
      name: "Nested Product Calculation",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation: "For each position i, run an inner loop over all j from 0 to n-1. If j != i, multiply nums[j] into the running product. Stores no extra arrays but takes quadratic time.",
      codeLines: [
        { line: 1, text: "def productExceptSelf(nums):", note: "Brute force pairwise multiplication" },
        { line: 2, text: "    n = len(nums); ans = []", note: "Initialize result array" },
        { line: 3, text: "    for i in range(n):", note: "Outer loop: fix element i to exclude" },
        { line: 4, text: "        prod = 1", note: "Start running product at 1" },
        { line: 5, text: "        for j in range(n):", note: "Inner loop: scan every element j" },
        { line: 6, text: "            if i != j:", note: "Multiply all elements except the i-th one" },
        { line: 7, text: "                prod *= nums[j]", note: "Accumulate product" },
        { line: 8, text: "        ans.append(prod)", note: "Append computed product for index i" },
        { line: 9, text: "    return ans", note: "Return completed result array" }
      ],
      getSteps: (input) => {
        const nums = input.nums || [];
        const n = nums.length;
        const steps = [];
        const ans = [];

        steps.push({
          type: "init",
          codeLine: 1,
          nums: [...nums],
          ans: [],
          vars: { i: "-", j: "-", prod: "-", ans: "[]" },
          firstTimerExplanation: "Start Brute Force: For each index i, we loop through the entire array and multiply every element except nums[i].",
          status: "Initialize brute force multiplication."
        });

        for (let i = 0; i < n; i++) {
          let prod = 1;

          steps.push({
            type: "start_i",
            codeLine: 4,
            i,
            nums: [...nums],
            ans: [...ans],
            vars: { i, "nums[i]": nums[i], prod: 1, ans: `[${ans.join(", ")}]` },
            firstTimerExplanation: `Computing answer for index ${i} (nums[${i}] = ${nums[i]}). Exclude nums[${i}] and multiply all other elements.`,
            status: `Computing product for index ${i} (excluding nums[${i}]=${nums[i]}).`
          });

          for (let j = 0; j < n; j++) {
            if (i !== j) {
              const oldProd = prod;
              prod *= nums[j];
              steps.push({
                type: "multiply",
                codeLine: 7,
                i,
                j,
                nums: [...nums],
                ans: [...ans],
                vars: { i, j, "nums[j]": nums[j], calculation: `${oldProd} * ${nums[j]} = ${prod}`, prod },
                firstTimerExplanation: `Multiplying nums[${j}] (${nums[j]}): product is now ${prod}.`,
                status: `Multiplied nums[${j}]=${nums[j]}. Running prod = ${prod}.`
              });
            } else {
              steps.push({
                type: "skip_j",
                codeLine: 6,
                i,
                j,
                nums: [...nums],
                ans: [...ans],
                vars: { i, j, action: "Skip j == i (exclude self)" },
                firstTimerExplanation: `Index j = ${j} matches i = ${i}. Skip self!`,
                status: `Skip j = ${j} because it equals i.`
              });
            }
          }

          ans.push(prod);
          steps.push({
            type: "append_ans",
            codeLine: 8,
            i,
            nums: [...nums],
            ans: [...ans],
            vars: { i, finalProduct: prod, ans: `[${ans.join(", ")}]` },
            firstTimerExplanation: `Finished index ${i}! Result: ${prod}. ans array is now [${ans.join(", ")}].`,
            status: `ans[${i}] = ${prod}.`
          });
        }

        steps.push({
          type: "done",
          codeLine: 9,
          nums: [...nums],
          ans: [...ans],
          vars: { result: `[${ans.join(", ")}]`, verdict: "Completed" },
          firstTimerExplanation: `All ${n} products calculated! Final array: [${ans.join(", ")}]. Notice this required n * n = ${n * n} steps.`,
          status: `Complete! Return [${ans.join(", ")}].`
        });

        return steps;
      }
    },

    optimal: {
      name: "Two-Pass Prefix & Suffix Products",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1) extra",
      explanation: "Pass 1: Fill `ans[i]` with the product of all elements to the left of i (prefix product). Pass 2: Iterate backward, multiplying `ans[i]` by a running suffix product. Reuses the output array to achieve O(1) auxiliary space!",
      codeLines: [
        { line: 1, text: "def productExceptSelf(nums):", note: "Linear O(n) solution without division" },
        { line: 2, text: "    n = len(nums)", note: "Get length of array" },
        { line: 3, text: "    res = [1] * n", note: "Initialize result array with 1s" },
        { line: 4, text: "    prefix = 1", note: "Pass 1: Build left prefix products" },
        { line: 5, text: "    for i in range(n):", note: "Left-to-right pass" },
        { line: 6, text: "        res[i] = prefix; prefix *= nums[i]", note: "Store left product, then multiply by current number" },
        { line: 7, text: "    postfix = 1", note: "Pass 2: Build right suffix products" },
        { line: 8, text: "    for i in range(n - 1, -1, -1):", note: "Right-to-left reverse pass" },
        { line: 9, text: "        res[i] *= postfix; postfix *= nums[i]", note: "Combine prefix * suffix, then update suffix" },
        { line: 10, text: "    return res", note: "Return final array with products except self" }
      ],
      getSteps: (input) => {
        const nums = input.nums || [];
        const n = nums.length;
        const steps = [];
        const res = new Array(n).fill(1);
        let prefix = 1;

        steps.push({
          type: "init",
          codeLine: 3,
          nums: [...nums],
          res: [...res],
          pass: "Pass 1: Prefix",
          vars: { prefix: 1, postfix: "-", res: `[${res.join(", ")}]` },
          firstTimerExplanation: "Start Optimal: We initialize result array with 1s. In Pass 1, we traverse Left-to-Right storing the product of all elements to the left of each index.",
          status: "Initialize result array [1, 1, 1, 1]."
        });

        // Pass 1: Prefix
        for (let i = 0; i < n; i++) {
          res[i] = prefix;
          const oldPrefix = prefix;
          prefix *= nums[i];

          steps.push({
            type: "prefix_step",
            codeLine: 6,
            pass: "Pass 1: Prefix (Left to Right)",
            i,
            nums: [...nums],
            res: [...res],
            vars: { i, "res[i] (prefix)": res[i], "nums[i]": nums[i], "new prefix": `${oldPrefix} * ${nums[i]} = ${prefix}`, res: `[${res.join(", ")}]` },
            firstTimerExplanation: `Index ${i}: Left product is ${res[i]}. Update prefix for next position: ${oldPrefix} * ${nums[i]} = ${prefix}.`,
            status: `Pass 1: res[${i}] = ${res[i]} (prefix). Prefix now = ${prefix}.`
          });
        }

        // Pass 2: Postfix / Suffix
        let postfix = 1;
        steps.push({
          type: "start_pass_2",
          codeLine: 7,
          nums: [...nums],
          res: [...res],
          pass: "Pass 2: Suffix (Right to Left)",
          vars: { postfix: 1, res: `[${res.join(", ")}]` },
          firstTimerExplanation: "Pass 1 complete! Now Pass 2: We scan Right-to-Left, multiplying each res[i] by the running suffix product of all elements to the right.",
          status: "Start Pass 2: Right-to-left suffix multiplication."
        });

        for (let i = n - 1; i >= 0; i--) {
          const oldRes = res[i];
          res[i] *= postfix;
          const oldPostfix = postfix;
          postfix *= nums[i];

          steps.push({
            type: "postfix_step",
            codeLine: 9,
            pass: "Pass 2: Suffix (Right to Left)",
            i,
            nums: [...nums],
            res: [...res],
            vars: { i, "old res[i]": oldRes, postfix: oldPostfix, "res[i] = prefix * suffix": `${oldRes} * ${oldPostfix} = ${res[i]}`, "nums[i]": nums[i], "new postfix": `${oldPostfix} * ${nums[i]} = ${postfix}`, res: `[${res.join(", ")}]` },
            firstTimerExplanation: `Index ${i}: Multiply prefix (${oldRes}) by suffix (${oldPostfix}) = ${res[i]}! New suffix = ${oldPostfix} * ${nums[i]} = ${postfix}.`,
            status: `Pass 2: res[${i}] = ${oldRes} * ${oldPostfix} = ${res[i]}. Postfix now = ${postfix}.`
          });
        }

        steps.push({
          type: "done",
          codeLine: 10,
          nums: [...nums],
          res: [...res],
          vars: { finalResult: `[${res.join(", ")}]`, verdict: "Solved in O(n)!" },
          firstTimerExplanation: `Done! Computed all products except self in only 2 passes (2n steps) with NO division used! Final answer: [${res.join(", ")}].`,
          status: `Complete! Return [${res.join(", ")}].`
        });

        return steps;
      }
    },

    code: {
      python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        res = [1] * len(nums)
        prefix = 1
        for i in range(len(nums)):
            res[i] = prefix
            prefix *= nums[i]
        postfix = 1
        for i in range(len(nums) - 1, -1, -1):
            res[i] *= postfix
            postfix *= nums[i]
        return res`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int postfix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= postfix;
            postfix *= nums[i];
        }
        return res;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }
        int postfix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= postfix;
            postfix *= nums[i];
        }
        return res;
    }
};`
    },
    dryRunTable: [
      { step: "Pass 1: i=0", nums: "nums[0]=1", action: "res[0] = 1 (prefix)", runningPrefix: "1 * 1 = 1" },
      { step: "Pass 1: i=1", nums: "nums[1]=2", action: "res[1] = 1 (prefix)", runningPrefix: "1 * 2 = 2" },
      { step: "Pass 1: i=2", nums: "nums[2]=3", action: "res[2] = 2 (prefix)", runningPrefix: "2 * 3 = 6" },
      { step: "Pass 1: i=3", nums: "nums[3]=4", action: "res[3] = 6 (prefix)", runningPrefix: "6 * 4 = 24" },
      { step: "Pass 2: i=3", nums: "nums[3]=4", action: "res[3] = 6 * 1 = 6", runningPostfix: "1 * 4 = 4" },
      { step: "Pass 2: i=2", nums: "nums[2]=3", action: "res[2] = 2 * 4 = 8", runningPostfix: "4 * 3 = 12" },
      { step: "Pass 2: i=1", nums: "nums[1]=2", action: "res[1] = 1 * 12 = 12", runningPostfix: "12 * 2 = 24" },
      { step: "Pass 2: i=0", nums: "nums[0]=1", action: "res[0] = 1 * 24 = 24", runningPostfix: "Final: [24,12,8,6] ✓" }
    ]
  }

];

import { Question } from '@/types';

// 22 Digital Competencies with 6 levels each (A1, A2, B1, B2, C1, C2)
export const questionPool: Question[] = [
  // Competency 1: Basic Computer Operations - A1 Level
  {
    id: "1",
    text: "What is the primary function of a computer's operating system?",
    options: [
      "To manage hardware and software resources",
      "To create documents",
      "To browse the internet",
      "To play games"
    ],
    correctAnswer: 0,
    level: "A1",
    competency: "Basic Computer Operations"
  },
  {
    id: "2",
    text: "Which key combination is commonly used to copy text?",
    options: [
      "Ctrl + V",
      "Ctrl + C",
      "Ctrl + X",
      "Ctrl + Z"
    ],
    correctAnswer: 1,
    level: "A1",
    competency: "Basic Computer Operations"
  },
  {
    id: "3",
    text: "What does 'GUI' stand for in computing?",
    options: [
      "General User Interface",
      "Graphical User Interface",
      "Global User Interface",
      "Generic User Interface"
    ],
    correctAnswer: 1,
    level: "A1",
    competency: "Basic Computer Operations"
  },

  // Competency 1: Basic Computer Operations - A2 Level
  {
    id: "4",
    text: "Which file extension is typically used for executable programs in Windows?",
    options: [
      ".txt",
      ".doc",
      ".exe",
      ".jpg"
    ],
    correctAnswer: 2,
    level: "A2",
    competency: "Basic Computer Operations"
  },
  {
    id: "5",
    text: "What is the purpose of defragmenting a hard drive?",
    options: [
      "To delete files",
      "To organize data for faster access",
      "To increase storage space",
      "To install software"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Basic Computer Operations"
  },
  {
    id: "6",
    text: "Which component stores data permanently even when the computer is turned off?",
    options: [
      "RAM",
      "CPU",
      "Hard Drive",
      "Cache"
    ],
    correctAnswer: 2,
    level: "A2",
    competency: "Basic Computer Operations"
  },

  // Competency 2: Internet Browsing - A1 Level
  {
    id: "7",
    text: "What does 'URL' stand for?",
    options: [
      "Universal Resource Locator",
      "Uniform Resource Locator",
      "Universal Reference Link",
      "Uniform Reference Locator"
    ],
    correctAnswer: 1,
    level: "A1",
    competency: "Internet Browsing"
  },
  {
    id: "8",
    text: "Which of these is a web browser?",
    options: [
      "Microsoft Word",
      "Google Chrome",
      "Adobe Photoshop",
      "Windows Explorer"
    ],
    correctAnswer: 1,
    level: "A1",
    competency: "Internet Browsing"
  },
  {
    id: "9",
    text: "What does 'HTTP' stand for?",
    options: [
      "HyperText Transfer Protocol",
      "HyperText Translation Protocol",
      "High Transfer Text Protocol",
      "HyperText Transmission Protocol"
    ],
    correctAnswer: 0,
    level: "A1",
    competency: "Internet Browsing"
  },

  // Continue with more questions across levels for 44 total questions...
  // Adding questions for all levels to reach 44 questions

  // A2 Level questions
  {
    id: "10",
    text: "What is the difference between HTTP and HTTPS?",
    options: [
      "HTTPS is faster",
      "HTTPS is encrypted and more secure",
      "HTTP is newer",
      "There is no difference"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Internet Browsing"
  },
  {
    id: "11",
    text: "What is a browser cookie?",
    options: [
      "A type of virus",
      "A small data file stored by websites",
      "A browser extension", 
      "A search engine"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Internet Browsing"
  },
  {
    id: "12",
    text: "What does clearing browser cache accomplish?",
    options: [
      "Deletes all bookmarks",
      "Removes stored website data for fresh loading",
      "Uninstalls the browser",
      "Changes the homepage"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Internet Browsing"
  },
  {
    id: "13",
    text: "What is malware?",
    options: [
      "Good software",
      "Malicious software designed to harm computers",
      "Hardware components",
      "Internet connection"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Digital Security"
  },
  {
    id: "14",
    text: "What is the purpose of creating folders on a computer?",
    options: [
      "To make the computer faster",
      "To organize and categorize files",
      "To increase storage space",
      "To improve internet speed"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Data Management"
  },
  {
    id: "15",
    text: "What does 'backup' mean in data management?",
    options: [
      "Deleting old files",
      "Creating copies of important data for safety",
      "Moving files to a different folder",
      "Renaming files"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Data Management"
  },
  {
    id: "16",
    text: "What is cloud storage?",
    options: [
      "Storage in the atmosphere",
      "Online storage accessible via internet",
      "Physical storage in clouds",
      "Temporary storage"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Cloud Computing"
  },
  {
    id: "17",
    text: "Which of these is a cloud storage service?",
    options: [
      "Google Drive",
      "Microsoft Paint",
      "Calculator",
      "Notepad"
    ],
    correctAnswer: 0,
    level: "A2",
    competency: "Cloud Computing"
  },
  {
    id: "18",
    text: "What is the main advantage of cloud computing?",
    options: [
      "It's always free",
      "Access to resources from anywhere with internet",
      "It only works on Windows",
      "It's faster than local storage"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Cloud Computing"
  },
  {
    id: "19",
    text: "What does 'syncing' mean in cloud services?",
    options: [
      "Deleting files",
      "Keeping files updated across all devices",
      "Creating backups",
      "Sharing files publicly"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Cloud Computing"
  },
  {
    id: "20",
    text: "What is a digital image format?",
    options: [
      "The size of an image",
      "The way image data is stored (like JPG, PNG)",
      "The color of an image",
      "The brightness of an image"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Digital Content Creation"
  },
  {
    id: "21",
    text: "Which file format is best for photos with many colors?",
    options: [
      "TXT",
      "JPG",
      "EXE",
      "ZIP"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Digital Content Creation"
  },
  {
    id: "22",
    text: "What is a strong password?",
    options: [
      "Your name",
      "A complex combination of letters, numbers, and symbols",
      "Your birthday",
      "The word 'password'"
    ],
    correctAnswer: 1,
    level: "A2",
    competency: "Digital Security"
  },

  // B1 Level questions
  {
    id: "23",
    text: "What is the purpose of the BCC field in an email?",
    options: [
      "To send copies to multiple recipients visibly",
      "To send blind copies where recipients can't see each other",
      "To mark the email as important",
      "To schedule the email for later"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Email Management"
  },
  {
    id: "24",
    text: "Which email protocol is used for receiving emails?",
    options: [
      "SMTP",
      "FTP",
      "IMAP",
      "HTTP"
    ],
    correctAnswer: 2,
    level: "B1",
    competency: "Email Management"
  },
  {
    id: "25",
    text: "What are privacy settings in social media platforms used for?",
    options: [
      "To make posts more colorful",
      "To control who can see your content and personal information",
      "To increase followers",
      "To create better posts"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Social Media"
  },
  {
    id: "26",
    text: "What is digital footprint in the context of social media?",
    options: [
      "The size of your profile picture",
      "The trail of data you leave behind when using digital services",
      "The number of posts you make",
      "The time spent online"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Social Media"
  },
  {
    id: "27",
    text: "What is phishing in cybersecurity?",
    options: [
      "A type of fishing",
      "Fraudulent attempts to obtain sensitive information",
      "A computer game",
      "A programming language"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Digital Security"
  },
  {
    id: "28",
    text: "What is a firewall?",
    options: [
      "A physical wall",
      "A security system that monitors network traffic",
      "A type of virus",
      "A browser extension"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Digital Security"
  },
  {
    id: "29",
    text: "What should you look for to ensure a website is secure for online shopping?",
    options: [
      "Bright colors",
      "HTTPS in the URL and a padlock icon",
      "Many pop-up ads",
      "Fast loading speed"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "E-commerce"
  },
  {
    id: "30",
    text: "What is digital payment encryption?",
    options: [
      "A way to make payments faster",
      "Security technology that protects payment information",
      "A type of digital currency",
      "A payment method"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "E-commerce"
  },
  {
    id: "31",
    text: "What is the difference between synchronous and asynchronous communication?",
    options: [
      "Synchronous is real-time, asynchronous allows delayed response",
      "Synchronous is written, asynchronous is verbal",
      "Synchronous is formal, asynchronous is informal",
      "There is no difference"
    ],
    correctAnswer: 0,
    level: "B1",
    competency: "Digital Communication"
  },
  {
    id: "32",
    text: "What is netiquette in digital communication?",
    options: [
      "Internet speed",
      "The etiquette and proper behavior in online communication",
      "Network security",
      "Internet connection type"
    ],
    correctAnswer: 1,
    level: "B1",
    competency: "Digital Communication"
  },

  // B2 Level questions
  {
    id: "33",
    text: "In Microsoft Word, what does the 'Track Changes' feature do?",
    options: [
      "Automatically saves the document",
      "Records and highlights all edits made to the document",
      "Checks for spelling errors",
      "Counts the number of words"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Document Creation"
  },
  {
    id: "34",
    text: "What is the advantage of using styles in document formatting?",
    options: [
      "It makes the document colorful",
      "It ensures consistent formatting and easy global changes",
      "It reduces file size",
      "It prevents copying"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Document Creation"
  },
  {
    id: "35",
    text: "In Excel, what does the VLOOKUP function do?",
    options: [
      "Validates data entry",
      "Looks up values vertically in a table",
      "Creates charts",
      "Counts visible cells"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Spreadsheet Management"
  },
  {
    id: "36",
    text: "What is a pivot table used for in spreadsheet applications?",
    options: [
      "To create charts",
      "To summarize and analyze large datasets",
      "To format cells",
      "To create formulas"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Spreadsheet Management"
  },
  {
    id: "37",
    text: "What is two-factor authentication (2FA)?",
    options: [
      "Using two passwords",
      "An additional security layer requiring two forms of identification",
      "Having two user accounts",
      "Using two different browsers"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Digital Security"
  },
  {
    id: "38",
    text: "What is a VPN and why is it important for digital security?",
    options: [
      "Virtual Private Network - encrypts internet connection and hides IP address",
      "Very Personal Network - for family use only",
      "Verified Public Network - for business use",
      "Virtual Protection Network - antivirus software"
    ],
    correctAnswer: 0,
    level: "B2",
    competency: "Digital Security"
  },
  {
    id: "39",
    text: "What is SQL injection?",
    options: [
      "A medical procedure",
      "A type of database attack",
      "A programming language",
      "A hardware component"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Digital Security"
  },
  {
    id: "40",
    text: "What is penetration testing?",
    options: [
      "Testing internet speed",
      "Authorized testing of system security vulnerabilities",
      "Testing hardware components",
      "Testing software performance"
    ],
    correctAnswer: 1,
    level: "B2",
    competency: "Digital Security"
  },

  // C1 Level questions  
  {
    id: "41",
    text: "What is artificial intelligence?",
    options: [
      "Human intelligence",
      "Computer systems that can perform tasks requiring human intelligence",
      "A type of calculator",
      "Internet connection"
    ],
    correctAnswer: 1,
    level: "C1",
    competency: "Emerging Technologies"
  },
  {
    id: "42",
    text: "What is machine learning?",
    options: [
      "Learning to use machines",
      "A subset of AI where systems learn from data",
      "Physical training",
      "Computer assembly"
    ],
    correctAnswer: 1,
    level: "C1",
    competency: "Emerging Technologies"
  },
  {
    id: "43",
    text: "What is the Internet of Things (IoT)?",
    options: [
      "Internet for things",
      "Network of physical devices connected to the internet",
      "A shopping website",
      "A search engine"
    ],
    correctAnswer: 1,
    level: "C1",
    competency: "Emerging Technologies"
  },

  // C2 Level questions
  {
    id: "44",
    text: "What is blockchain technology?",
    options: [
      "A type of chain",
      "A distributed ledger technology",
      "A physical block",
      "A game"
    ],
    correctAnswer: 1,
    level: "C2",
    competency: "Emerging Technologies"
  }
];

// Helper function to get questions by step
export const getQuestionsByStep = (step: 1 | 2 | 3): Question[] => {
  const levels: Record<number, string[]> = {
    1: ['A1', 'A2'],
    2: ['B1', 'B2'], 
    3: ['C1', 'C2']
  };
  
  const stepLevels = levels[step];
  const stepQuestions = questionPool.filter(q => stepLevels.includes(q.level));
  
  // Shuffle and return 44 questions for the step
  const shuffled = [...stepQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(44, shuffled.length));
};

// Helper function to calculate score and certification level
export const calculateResult = (answers: number[], questions: Question[], step: 1 | 2 | 3) => {
  const correctAnswers = answers.reduce((count, answer, index) => {
    return answer === questions[index].correctAnswer ? count + 1 : count;
  }, 0);
  
  const percentage = (correctAnswers / questions.length) * 100;
  
  let certification = '';
  let canProceed = false;
  
  if (step === 1) {
    if (percentage < 25) {
      certification = 'Failed - No retake allowed';
    } else if (percentage < 50) {
      certification = 'A1 Certified';
    } else if (percentage < 75) {
      certification = 'A2 Certified';
    } else {
      certification = 'A2 Certified';
      canProceed = true;
    }
  } else if (step === 2) {
    if (percentage < 25) {
      certification = 'Remain at A2';
    } else if (percentage < 50) {
      certification = 'B1 Certified';
    } else if (percentage < 75) {
      certification = 'B2 Certified';
    } else {
      certification = 'B2 Certified';
      canProceed = true;
    }
  } else if (step === 3) {
    if (percentage < 25) {
      certification = 'Remain at B2';
    } else if (percentage < 50) {
      certification = 'C1 Certified';
    } else {
      certification = 'C2 Certified';
    }
  }
  
  return {
    score: correctAnswers,
    totalQuestions: questions.length,
    percentage: Math.round(percentage * 100) / 100,
    certification,
    canProceed
  };
};
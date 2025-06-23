// courseDataHandler.js


class CourseDataHandler {
    constructor(jsonFilePath = 'Course-Subject.json') {
      this.jsonFilePath = jsonFilePath;
      this.courseData = null;
      this.currentCourse = null;
      this.isDataLoaded = false;
    }
  
    // Load the course data from the JSON file
    async loadCourseData() {
      try {
        const response = await fetch(this.jsonFilePath);
        if (!response.ok) {
          throw new Error(`Failed to load course data: ${response.status} ${response.statusText}`);
        }
        
        this.courseData = await response.json();
        this.isDataLoaded = true;
        console.log(`Loaded ${this.courseData.length} courses successfully`);
        
        return this.courseData;
      } catch (error) {
        console.error('Error loading course data:', error);
        return null;
      }
    }
  
    // Get all courses
    getAllCourses() {
      if (!this.isDataLoaded) {
        console.warn('Course data not loaded yet. Call loadCourseData() first.');
        return [];
      }
      return this.courseData;
    }
  
    // Get a specific course by acronym
    getCourseByAcronym(acronym) {
      if (!this.isDataLoaded) {
        console.warn('Course data not loaded yet. Call loadCourseData() first.');
        return null;
      }
      
      const course = this.courseData.find(c => c.acronym === acronym);
      if (course) {
        this.currentCourse = course;
      }
      return course;
    }
  
    // Search courses by query
    searchCourses(query) {
      if (!this.isDataLoaded || !query) {
        return [];
      }
      
      const searchTerm = query.toLowerCase();
      return this.courseData.filter(course => 
        course.course_name.toLowerCase().includes(searchTerm) || 
        course.overview.toLowerCase().includes(searchTerm) || 
        course.short_overview.toLowerCase().includes(searchTerm)
      );
    }
  
    // Get courses by year
    getCoursesByYear(year) {
      if (!this.isDataLoaded) {
        return [];
      }
      
      const yearKey = `year_${year}`;
      return this.courseData.filter(course => 
        course.modules && 
        course.modules[yearKey] && 
        course.modules[yearKey].length > 0
      );
    }
  
    // Get all modules for a specific course
    getModulesForCourse(acronym) {
      const course = this.getCourseByAcronym(acronym);
      if (!course || !course.modules) {
        return [];
      }
      
      const allModules = [];
      Object.keys(course.modules).forEach(year => {
        course.modules[year].forEach(module => {
          allModules.push({
            ...module,
            year: year.replace('year_', '')
          });
        });
      });
      
      return allModules;
    }
  
    // Get modules for a specific year in a course
    getModulesForYear(acronym, year) {
      const course = this.getCourseByAcronym(acronym);
      if (!course || !course.modules) {
        return [];
      }
      
      const yearKey = `year_${year}`;
      return course.modules[yearKey] || [];
    }
  
    // Parse radar chart data 
    parseRadarChartData(radarString) {
      if (!radarString) return [];
      
      const pairs = radarString.split(';');
      return pairs.map(pair => {
        const [label, value] = pair.split(':');
        return {
          label,
          value: parseFloat(value)
        };
      });
    }





    // extra code for the json web test 
    
    // Generate consistent colors for a course based on its acronym
    generateCourseColors(acronym) {
      // Simple hash function to get a consistent color based on the acronym
      const hash = [...acronym].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      // Generate HSL color
      const h = Math.abs(hash % 360);
      
      return {
        primary: `hsl(${h}, 70%, 50%)`,
        secondary: `hsl(${h}, 70%, 80%)`,
        accent: `hsl(${(h + 180) % 360}, 70%, 50%)`
      };
    }
    
    // Get course emoji based on acronym
    getCourseEmoji(acronym) {
      // emoji map 
      const emojiMap = {
        'CS': '💻',
        'SE': '🛠️',
        'BIT': '📊',
        'CIT': '🌐',
        'DS': '📈',
        'CE': '⚙️'
      };
      
      return emojiMap[acronym] || '📚';
    }
  }
  
  // Make it available globally
  if (typeof window !== 'undefined') {
    window.CourseDataHandler = CourseDataHandler;
  }
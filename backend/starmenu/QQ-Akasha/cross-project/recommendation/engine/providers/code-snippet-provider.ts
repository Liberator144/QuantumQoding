/**
 * Code snippet recommendation provider
 */

import { RecommendationProvider } from './types';
import {
  Recommendation,
  RecommendationContext,
  RecommendationType,
  RecommendationCategory,
  RecommendationPriority,
} from '../types';
import { detectPatterns } from '../../code-generation/patterns/pattern-detector';
import { patternRegistry } from '../../code-generation/patterns/pattern-registry';
import { v4 as uuidv4 } from 'uuid';

/**
 * Code snippet recommendation provider
 */
export class CodeSnippetProvider implements RecommendationProvider {
  name = 'CodeSnippetProvider';
  description = 'Provides code snippet recommendations';

  /**
   * Get code snippet recommendations
   */
  async getRecommendations(context: RecommendationContext): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    try {
      // Get recommendations based on detected patterns
      const patternRecommendations = await this.getPatternBasedRecommendations(context);
      recommendations.push(...patternRecommendations);

      // Get recommendations based on file type
      const fileTypeRecommendations = await this.getFileTypeRecommendations(context);
      recommendations.push(...fileTypeRecommendations);

      // Get recommendations based on imports
      const importRecommendations = await this.getImportBasedRecommendations(context);
      recommendations.push(...importRecommendations);

      return recommendations;
    } catch (error) {
      console.error('Error getting code snippet recommendations:', error);
      return [];
    }
  }

  /**
   * Get pattern-based recommendations
   */
  private async getPatternBasedRecommendations(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Detect patterns in the file
    const detectedPatterns = detectPatterns(context.fileContext);

    // Create recommendations for each detected pattern
    for (const patternResult of detectedPatterns) {
      const pattern = patternRegistry.getPattern(patternResult.pattern);

      if (!pattern) {
        continue;
      }

      // Create recommendation
      recommendations.push({
        id: uuidv4(),
        type: RecommendationType.CODE_SNIPPET,
        category: RecommendationCategory.CODE_GENERATION,
        title: `${pattern.name} Pattern`,
        description: pattern.description,
        content:
          pattern.examples[context.fileContext.language] ||
          Object.values(pattern.examples)[0] ||
          '',
        priority: RecommendationPriority.MEDIUM,
        relevanceScore: patternResult.confidence,
        tags: [pattern.category, pattern.type, 'pattern'],
        language: context.fileContext.language,
        pattern: pattern.type,
        source: 'pattern-detection',
        createdAt: new Date(),
        metadata: {
          patternType: pattern.type,
          patternCategory: pattern.category,
          confidence: patternResult.confidence,
          matchingElements: patternResult.matchingElements,
          detectionDetails: patternResult.details,
        },
      });
    }

    return recommendations;
  }

  /**
   * Get file type-based recommendations
   */
  private async getFileTypeRecommendations(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get file extension
    const fileExt = context.fileContext.filePath.split('.').pop()?.toLowerCase();

    if (!fileExt) {
      return recommendations;
    }

    // Create recommendations based on file type
    switch (fileExt) {
      case 'ts':
      case 'tsx':
        recommendations.push(this.createTypeScriptRecommendation(context));
        break;

      case 'js':
      case 'jsx':
        recommendations.push(this.createJavaScriptRecommendation(context));
        break;

      case 'py':
        recommendations.push(this.createPythonRecommendation(context));
        break;

      case 'java':
        recommendations.push(this.createJavaRecommendation(context));
        break;

      case 'html':
        recommendations.push(this.createHtmlRecommendation(context));
        break;

      case 'css':
        recommendations.push(this.createCssRecommendation(context));
        break;
    }

    return recommendations;
  }

  /**
   * Get import-based recommendations
   */
  private async getImportBasedRecommendations(
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Check imports
    for (const importDecl of context.fileContext.imports) {
      const source = importDecl.source.toLowerCase();

      // React recommendations
      if (source.includes('react')) {
        recommendations.push(this.createReactRecommendation(context));
      }

      // Express recommendations
      if (source.includes('express')) {
        recommendations.push(this.createExpressRecommendation(context));
      }

      // Redux recommendations
      if (source.includes('redux')) {
        recommendations.push(this.createReduxRecommendation(context));
      }
    }

    return recommendations;
  }

  /**
   * Create TypeScript recommendation
   */
  private createTypeScriptRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'TypeScript Interface',
      description: 'Create a TypeScript interface for your data model',
      content: `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['typescript', 'interface', 'model'],
      language: 'typescript',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'typescript',
      },
    };
  }

  /**
   * Create JavaScript recommendation
   */
  private createJavaScriptRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'JavaScript Class',
      description: 'Create a JavaScript class for your data model',
      content: `class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  
  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }
}`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['javascript', 'class', 'model'],
      language: 'javascript',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'javascript',
      },
    };
  }

  /**
   * Create Python recommendation
   */
  private createPythonRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'Python Class',
      description: 'Create a Python class for your data model',
      content: `class User:
    def __init__(self, id, name, email):
        self.id = id
        self.name = name
        self.email = email
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        self.updated_at = datetime.now()`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['python', 'class', 'model'],
      language: 'python',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'python',
      },
    };
  }

  /**
   * Create Java recommendation
   */
  private createJavaRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'Java Class',
      description: 'Create a Java class for your data model',
      content: `public class User {
    private String id;
    private String name;
    private String email;
    private Date createdAt;
    private Date updatedAt;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void update() {
        this.updatedAt = new Date();
    }
}`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['java', 'class', 'model'],
      language: 'java',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'java',
      },
    };
  }

  /**
   * Create HTML recommendation
   */
  private createHtmlRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'HTML Form',
      description: 'Create an HTML form',
      content: `<form action="/submit" method="post">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" class="form-control" required>
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" class="form-control" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['html', 'form', 'ui'],
      language: 'html',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'html',
      },
    };
  }

  /**
   * Create CSS recommendation
   */
  private createCssRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'CSS Flexbox',
      description: 'Create a CSS flexbox layout',
      content: `.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1 1 300px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.7,
      tags: ['css', 'flexbox', 'layout'],
      language: 'css',
      source: 'file-type',
      createdAt: new Date(),
      metadata: {
        fileType: 'css',
      },
    };
  }

  /**
   * Create React recommendation
   */
  private createReactRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'React Functional Component',
      description: 'Create a React functional component with hooks',
      content: `import React, { useState, useEffect } from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`\${title} (\${count})\`;
    
    return () => {
      document.title = 'React App';
    };
  }, [title, count]);
  
  const handleClick = () => {
    setCount(count + 1);
    onAction();
  };
  
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default MyComponent;`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.8,
      tags: ['react', 'component', 'hooks'],
      language: 'typescript',
      source: 'import-based',
      createdAt: new Date(),
      metadata: {
        importSource: 'react',
      },
    };
  }

  /**
   * Create Express recommendation
   */
  private createExpressRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'Express Route Handler',
      description: 'Create an Express route handler with middleware',
      content: `import express from 'express';
import { authenticate } from '../middleware/auth';
import { validateUser } from '../middleware/validation';

const router = express.Router();

// Get all users
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create user
router.post('/', [authenticate, validateUser], async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.8,
      tags: ['express', 'route', 'api'],
      language: 'typescript',
      source: 'import-based',
      createdAt: new Date(),
      metadata: {
        importSource: 'express',
      },
    };
  }

  /**
   * Create Redux recommendation
   */
  private createReduxRecommendation(context: RecommendationContext): Recommendation {
    return {
      id: uuidv4(),
      type: RecommendationType.CODE_SNIPPET,
      category: RecommendationCategory.CODE_GENERATION,
      title: 'Redux Slice',
      description: 'Create a Redux slice with Redux Toolkit',
      content: `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter(user => user.id !== action.payload);
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  addUser,
  updateUser,
  deleteUser
} = userSlice.actions;

export default userSlice.reducer;`,
      priority: RecommendationPriority.MEDIUM,
      relevanceScore: 0.8,
      tags: ['redux', 'slice', 'state-management'],
      language: 'typescript',
      source: 'import-based',
      createdAt: new Date(),
      metadata: {
        importSource: 'redux',
      },
    };
  }
}

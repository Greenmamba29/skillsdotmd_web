import * as yaml from 'js-yaml';

export interface ValidationResult {
  valid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  rule: string;
  message: string;
  line?: number;
}

export interface ValidationWarning {
  rule: string;
  message: string;
  suggestion?: string;
}

interface SkillFrontmatter {
  name?: string;
  description?: string;
  tags?: string[];
  license?: string;
  version?: string;
  author?: string;
  video?: string;
  [key: string]: unknown;
}

export function validateSkillMd(content: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let score = 100;

  // Check frontmatter exists
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    errors.push({
      rule: 'SKL001',
      message: 'Missing YAML frontmatter (must start with --- and end with ---)',
    });
    return { valid: false, score: 0, errors, warnings };
  }

  // Parse frontmatter
  let frontmatter: SkillFrontmatter;
  try {
    frontmatter = yaml.load(fmMatch[1]) as SkillFrontmatter;
  } catch (e) {
    errors.push({
      rule: 'SKL002',
      message: `Invalid YAML in frontmatter: ${(e as Error).message}`,
    });
    return { valid: false, score: 0, errors, warnings };
  }

  // Required fields
  if (!frontmatter.name) {
    errors.push({ rule: 'SKL003', message: 'Missing required field: name' });
    score -= 20;
  } else {
    if (frontmatter.name.length > 64) {
      errors.push({ rule: 'SKL004', message: 'Name must be 64 characters or fewer' });
      score -= 10;
    }
    if (!/^[a-z0-9-]+$/.test(frontmatter.name)) {
      warnings.push({
        rule: 'SKL005',
        message: 'Name should use kebab-case (lowercase, hyphens only)',
        suggestion: frontmatter.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      score -= 5;
    }
  }

  if (!frontmatter.description) {
    errors.push({ rule: 'SKL006', message: 'Missing required field: description' });
    score -= 20;
  } else if (frontmatter.description.length > 500) {
    warnings.push({
      rule: 'SKL007',
      message: 'Description is over 500 characters — consider shortening',
    });
    score -= 5;
  }

  // Recommended fields
  if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) {
    warnings.push({
      rule: 'SKL008',
      message: 'Missing tags field — tags improve discoverability',
    });
    score -= 5;
  }

  if (!frontmatter.license) {
    warnings.push({
      rule: 'SKL009',
      message: 'Missing license field — specify a license for sharing',
    });
    score -= 5;
  }

  if (!frontmatter.version) {
    warnings.push({
      rule: 'SKL010',
      message: 'Missing version field — helps track updates',
    });
    score -= 3;
  }

  // Body content checks
  const body = content.slice(fmMatch[0].length).trim();

  if (body.length === 0) {
    errors.push({ rule: 'SKL011', message: 'Empty skill body — must contain instructions' });
    score -= 30;
  } else if (body.length < 50) {
    warnings.push({
      rule: 'SKL012',
      message: 'Skill body is very short — add detailed usage instructions',
    });
    score -= 10;
  }

  // Check for "when to use" or trigger hints
  const lowerBody = body.toLowerCase();
  if (!lowerBody.includes('when') && !lowerBody.includes('use this') && !lowerBody.includes('trigger')) {
    warnings.push({
      rule: 'SKL013',
      message: 'No "when to use" hint found — agents need context for when to activate this skill',
    });
    score -= 5;
  }

  // Check for headings (structure)
  if (!body.includes('##') && !body.includes('# ')) {
    warnings.push({
      rule: 'SKL014',
      message: 'No headings found — use Markdown headings to structure instructions',
    });
    score -= 3;
  }

  return {
    valid: errors.length === 0,
    score: Math.max(0, score),
    errors,
    warnings,
  };
}

export function parseFrontmatter(content: string): SkillFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]) as SkillFrontmatter;
  } catch {
    return null;
  }
}

export function extractBody(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n?([\s\S]*)/);
  return match ? match[1].trim() : content;
}

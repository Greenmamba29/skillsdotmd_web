| name | description | license | tags |
|------|-------------|---------|------|
| terraform-style-check | Audit Terraform and OpenTofu configurations for style, best practices, security, and compliance. Checks naming conventions, resource organization, variable usage, module structure, and IAM least-privilege patterns. | MIT | --- terraform infrastructure devops security iac |

# Terraform Style Check

## Overview

Audit Terraform (and OpenTofu) configurations for style consistency, security best practices, module structure, and compliance requirements. Provides actionable fixes with severity ratings.

## When to Use

- Before merging infrastructure PRs for code review
- When onboarding a new Terraform codebase with inconsistent patterns
- When enforcing organizational IaC standards across teams
- When conducting security audits of cloud infrastructure code
- When preparing infrastructure code for compliance certification

## Instructions

1. Accept path to Terraform directory or specific `.tf` files.
2. Parse all `.tf` files and build an AST representation.
3. Style checks:
   - Naming conventions: resources use `snake_case`, descriptive names.
   - File organization: `main.tf`, `variables.tf`, `outputs.tf`, `versions.tf` separation.
   - Variable declarations: all variables have `type`, `description`, and `default` where appropriate.
   - Output declarations: all outputs have `description`.
   - Resource tagging: required tags (env, owner, project) present on all taggable resources.
4. Best practice checks:
   - Remote state: backend configured, not using local state in production.
   - Module versions: all module sources pinned to specific version.
   - Provider versions: all providers pinned with `~>` constraint.
   - Sensitive variables: marked with `sensitive = true`.
5. Security checks:
   - IAM policies: no `*` on actions without explicit justification comment.
   - Security groups: no `0.0.0.0/0` on inbound rules except ports 80/443.
   - Encryption: storage resources (S3, RDS, EBS) have encryption enabled.
   - Public access: S3 buckets not publicly accessible without justification.
6. Generate report: issues grouped by severity (Critical, High, Medium, Low, Info).
7. For each issue: file, line number, current code, and recommended fix.

## Environment

```
CHECK_NAMING=true
CHECK_SECURITY=true
CHECK_MODULES=true
REQUIRED_TAGS=env,owner,project
STRICT_IAM=true
```

## Examples

**Input:**
```
path: ./infrastructure/aws
profile: production
check_level: full
```

**Output:**
```
Terraform Style Check Report
Files scanned: 18
Total issues: 23

Critical (2):
- security_groups.tf:45 - Inbound rule allows 0.0.0.0/0 on port 22 (SSH)
- iam.tf:78 - IAM policy uses wildcard action "s3:*" without justification

High (5):
- main.tf:12 - Module source not pinned to version (add ?ref=v2.1.0)
- variables.tf:34 - Variable 'db_password' missing sensitive=true
- rds.tf:23 - RDS instance encryption not enabled

Medium (8): [naming, tagging issues]
Low (8): [style, description missing]
```

# Product Overview

Lumina Knowledge Base is an educational platform backend that manages academic content and relationships. The system models universities, faculties, degrees, courses, modules, and questions in a hierarchical structure.

## Core Features

- **Academic Hierarchy**: Universities → Faculties → Degrees → Courses → Modules → Questions
- **Prerequisite Management**: Block-based system for managing course and module prerequisites/postrequisites
- **Multilingual Support**: Built-in translation system supporting English and Hebrew
- **Question System**: Support for multiple question types (selection, value, void) with validation workflow
- **GraphQL API**: Primary interface for data access and manipulation
- **REST API**: OpenAPI/Swagger documentation available for REST endpoints

## Key Entities

- **Universities**: Top-level academic institutions
- **Faculties**: Organizational units within universities
- **Degrees**: Academic programs offered by faculties
- **Courses**: Individual courses within degree programs
- **Modules**: Granular learning units within courses
- **Questions**: Assessment items linked to modules
- **Blocks**: Abstract entities for managing prerequisite relationships
- **Translations**: Multilingual content support

The system is designed to support educational content management with complex relationships and multilingual requirements.

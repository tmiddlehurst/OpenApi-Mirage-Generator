import inquirer from 'inquirer';
import { generate } from './src/generate';

generate('./tests/test-specs/crud-no-refs.json', 'mirage', inquirer.prompt);
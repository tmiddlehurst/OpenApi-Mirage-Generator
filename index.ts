import inquirer from 'inquirer';
import generate from './src/generate';

generate(Bun.argv[2], Bun.argv[3], inquirer.prompt);
import { expect, test, describe } from "bun:test";
import { getModelChoicesFromSchemas, isPluralOfOtherSchema } from '../src/promptForModels';

describe("Prompting member to choose models to define", () => {

  test("only includes object type schemas in modelChoices", () => {
    const schemas = {
      PutOrCall: {
        type: 'string',
        enum: ['Put', 'Call', 'Chooser', 'Other', 'DEFAULT']
      },
      MemberNote: {
        type: "object",
        properties: {
          memberLoginName: "string",
          text: "string",
          adminUserLoginName: "string",
        }
      }
    };

    const filteredSchemas = getModelChoicesFromSchemas(schemas);
    console.log(filteredSchemas);
    expect(filteredSchemas.length).toBe(1);
    expect(filteredSchemas[0].name).toBe('MemberNote');
  });

  test("disables models with names from ignore list in modelChoices", () => {
    const schemas = {
      MemberNote: {
        type: "object",
        properties: {
          memberLoginName: "string",
          text: "string",
          adminUserLoginName: "string",
        }
      },
      Error: {
        type: "object",
        properties: {
          message: "string",
          text: "string",
          code: "string",
        }
      }
    };

    const filteredSchemas = getModelChoicesFromSchemas(schemas);
    console.log(filteredSchemas);
    expect(filteredSchemas.length).toBe(2);
    expect(filteredSchemas[1].checked).toBe(false);
  });

});

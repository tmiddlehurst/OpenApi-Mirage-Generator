import { expect, test, describe } from "bun:test";
import { getModelChoicesFromSchemas } from '../src/promptUserForModels';

describe("Prompting member to choose models to define", () => {

  test("includes schemas in modelChoices", () => {
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
    expect(filteredSchemas.length).toBe(2);
    expect(filteredSchemas[0].name).toBe('PutOrCall');
    expect(filteredSchemas[1].name).toBe('MemberNote');
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

  test("disables model by default if it is plural of another", () => {
    const schemas = {
      MemberNote: {
        type: "object",
        properties: {
          memberLoginName: "string",
          text: "string",
          adminUserLoginName: "string",
        }
      },
      MemberNotes: {
        type: "object",
        properties: {
          notes: {
            $ref: '#/components/MemberNote'
          },
          count: "integer",
          pageNumber: "integer",
        }
      }
    };

    const filteredSchemas = getModelChoicesFromSchemas(schemas);
    console.log(filteredSchemas);
    expect(filteredSchemas.length).toBe(2);
    // @ts-expect-error this always exists
    expect(filteredSchemas.find(s => s.name === 'MemberNotes').checked).toBe(false);
    // @ts-expect-error this always exists
    expect(filteredSchemas.find(s => s.name === 'MemberNote').checked).toBe(true);
  });

});

export type Paths = MappedEndpoints["paths"];
export type Endpoints = keyof Paths;
export type Methods<Endpoint extends Endpoints> = keyof Paths[Endpoint];
export type AllSchemaInformation = MappedEndpoints["components"]["schemas"];
export type SchemaNames = keyof AllSchemaInformation;

type MappedEndpoints = {
  openapi: "3.0.1";
  info: {
    title: "FitnessTracker";
    version: "1.0";
  };
  paths: {
    "/api/equipment": {
      post: {
        tags: ["Equipment"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateEquipmentRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateEquipmentRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateEquipmentRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["Equipment"];
        parameters: [
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "include";
            in: "query";
            schema: {
              type: "string";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/equipment/range": {
      post: {
        tags: ["Equipment"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateEquipmentRequestDTO";
                };
              };
            };
            "text/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateEquipmentRequestDTO";
                };
              };
            };
            "application/*+json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateEquipmentRequestDTO";
                };
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/exercise": {
      post: {
        tags: ["Exercise"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateExerciseRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateExerciseRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateExerciseRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "muscleGroupId";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "equipmentId";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          },
          {
            name: "favoriteOnly";
            in: "query";
            schema: {
              type: "boolean";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleExerciseResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleExerciseResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleExerciseResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      put: {
        tags: ["Exercise"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateExerciseRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateExerciseRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateExerciseRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/exercise/{id}": {
      delete: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/exercise/{id}/favorite": {
      post: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/exercise/{id}/detailed": {
      get: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedExerciseResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedExerciseResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedExerciseResponseDTO";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/muscle": {
      post: {
        tags: ["Muscle"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["Muscle"];
        parameters: [
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "include";
            in: "query";
            schema: {
              type: "string";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/muscle/range": {
      post: {
        tags: ["Muscle"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleRequestDTO";
                };
              };
            };
            "text/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleRequestDTO";
                };
              };
            };
            "application/*+json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleRequestDTO";
                };
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/muscle/{id}": {
      delete: {
        tags: ["Muscle"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/musclegroup": {
      post: {
        tags: ["MuscleGroup"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["MuscleGroup"];
        parameters: [
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/musclegroup/range": {
      post: {
        tags: ["MuscleGroup"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
                };
              };
            };
            "text/json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
                };
              };
            };
            "application/*+json": {
              schema: {
                type: "array";
                items: {
                  $ref: "#/components/schemas/CreateMuscleGroupRequestDTO";
                };
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/musclegroup/{id}": {
      delete: {
        tags: ["MuscleGroup"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/musclegroup/detailed": {
      get: {
        tags: ["MuscleGroup"];
        parameters: [
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/DetailedMuscleGroupResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/DetailedMuscleGroupResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/DetailedMuscleGroupResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split": {
      post: {
        tags: ["Split"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{splitId}/comment": {
      post: {
        tags: ["Split"];
        parameters: [
          {
            name: "splitId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "splitId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{splitId}/comment/{parentId}/reply": {
      post: {
        tags: ["Split"];
        parameters: [
          {
            name: "splitId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "parentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateSplitCommentRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{splitId}/comment/{commentId}": {
      delete: {
        tags: ["Split"];
        parameters: [
          {
            name: "splitId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "commentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{id}/favorite": {
      post: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{id}/like": {
      post: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/comment/{id}/like": {
      post: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/public/simple": {
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/public/simple/by/{userId}": {
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "userId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/personal/simple": {
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{id}/detailed": {
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedSplitResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedSplitResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedSplitResponseDTO";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{splitId}/comment/{commentId}/reply": {
      get: {
        tags: ["Split"];
        parameters: [
          {
            name: "splitId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "commentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleSplitCommentResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{id}/baseinfo": {
      patch: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitBaseInfoRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitBaseInfoRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitBaseInfoRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/split/{id}/workout/{day}": {
      patch: {
        tags: ["Split"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "day";
            in: "path";
            required: true;
            schema: {
              $ref: "#/components/schemas/DayOfWeek";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitWorkoutRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitWorkoutRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitWorkoutRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/register": {
      post: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterUserRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/RegisterUserRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/RegisterUserRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
            };
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/login": {
      post: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginUserRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/LoginUserRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/LoginUserRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
            };
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/refresh": {
      post: {
        tags: ["User"];
        responses: {
          "201": {
            description: "Created";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/SimpleJWTResponseDTO";
                };
              };
            };
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/logout": {
      delete: {
        tags: ["User"];
        responses: {
          "204": {
            description: "No Content";
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/resendconfirmationemail": {
      post: {
        tags: ["User"];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/confirmemail/{code}": {
      patch: {
        tags: ["User"];
        parameters: [
          {
            name: "code";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/{id}/follow": {
      post: {
        tags: ["User"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["User"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/forgotpassword": {
      post: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SendForgotPasswordEmailRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/SendForgotPasswordEmailRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/SendForgotPasswordEmailRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/forgotpassword/{code}": {
      patch: {
        tags: ["User"];
        parameters: [
          {
            name: "code";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordUserRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordUserRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/ResetPasswordUserRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/split/today/completeworkout": {
      post: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateCompletedWorkoutRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateCompletedWorkoutRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateCompletedWorkoutRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/detailed": {
      get: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedUserResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedUserResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedUserResponseDTO";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/{id}/detailed": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedPublicUserResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedPublicUserResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedPublicUserResponseDTO";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/{id}/following": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/{id}/followers": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleUserResponseDTO";
                  };
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/streak": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "year";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/{userId}/streak": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "userId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "year";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWeekOfCompletedWorkoutsResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/streak/week/{date}": {
      get: {
        tags: ["User"];
        parameters: [
          {
            name: "date";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "date-time";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedWeekOfCompletedWorkoutsResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedWeekOfCompletedWorkoutsResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedWeekOfCompletedWorkoutsResponseDTO";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/changepassword": {
      patch: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdatePasswordUserRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdatePasswordUserRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdatePasswordUserRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/user/me/split": {
      patch: {
        tags: ["User"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitUserRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitUserRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateSplitUserRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout": {
      post: {
        tags: ["Workout"];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/NewWorkoutResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/NewWorkoutResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/NewWorkoutResponseDTO";
                };
              };
            };
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{workoutId}/comment": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "workoutId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "workoutId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{workoutId}/comment/{parentId}/reply": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "workoutId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "parentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateWorkoutCommentRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{workoutId}/comment/{commentId}": {
      delete: {
        tags: ["Workout"];
        parameters: [
          {
            name: "workoutId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "commentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/favorite": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/like": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/comment/{id}/like": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/public/simple": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/public/simple/by/{userId}": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "userId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/personal/simple": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/favorite/simple": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "name";
            in: "query";
            schema: {
              type: "string";
            };
          },
          {
            name: "limit";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          },
          {
            name: "offset";
            in: "query";
            schema: {
              type: "integer";
              format: "int32";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/detailed": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/DetailedWorkoutResponseDTO";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedWorkoutResponseDTO";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/DetailedWorkoutResponseDTO";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{workoutId}/comment/{commentId}/reply": {
      get: {
        tags: ["Workout"];
        parameters: [
          {
            name: "workoutId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "commentId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "200": {
            description: "OK";
            content: {
              "text/plain": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
              "application/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
              "text/json": {
                schema: {
                  type: "array";
                  items: {
                    $ref: "#/components/schemas/SimpleWorkoutCommentResponseDTO";
                  };
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/baseinfo": {
      patch: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateWorkoutBaseInfoRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateWorkoutBaseInfoRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateWorkoutBaseInfoRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/set/{setId}": {
      patch: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "setId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSetRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/UpdateSetRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/UpdateSetRequestDTO";
              };
            };
          };
        };
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
      delete: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          },
          {
            name: "setId";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        responses: {
          "204": {
            description: "No Content";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
    "/api/workout/{id}/set": {
      post: {
        tags: ["Workout"];
        parameters: [
          {
            name: "id";
            in: "path";
            required: true;
            schema: {
              type: "string";
              format: "uuid";
            };
          }
        ];
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateSetRequestDTO";
              };
            };
            "text/json": {
              schema: {
                $ref: "#/components/schemas/CreateSetRequestDTO";
              };
            };
            "application/*+json": {
              schema: {
                $ref: "#/components/schemas/CreateSetRequestDTO";
              };
            };
          };
        };
        responses: {
          "201": {
            description: "Created";
          };
          "400": {
            description: "Bad Request";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "401": {
            description: "Unauthorized";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "403": {
            description: "Forbidden";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "404": {
            description: "Not Found";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
          "429": {
            description: "Too Many Requests";
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/ProblemDetails";
                };
              };
            };
          };
        };
      };
    };
  };
  components: {
    schemas: {
      CreateCompletedSetRequestDTO: {
        type: "object";
        properties: {
          weightUsed: {
            type: "number";
            format: "float";
          };
          repsCompleted: {
            type: "integer";
            format: "int32";
          };
          setId: {
            type: "string";
            format: "uuid";
          };
        };
        additionalProperties: false;
      };
      CreateCompletedWorkoutRequestDTO: {
        type: "object";
        properties: {
          completedSets: {
            type: "array";
            items: {
              $ref: "#/components/schemas/CreateCompletedSetRequestDTO";
            };
          };
        };
        additionalProperties: false;
      };
      CreateEquipmentRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      CreateExerciseRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
          };
          image: {
            type: "string";
            nullable: true;
          };
          primaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          primaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          secondaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          secondaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          equipment: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
        };
        additionalProperties: false;
      };
      CreateMuscleGroupRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      CreateMuscleRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          muscleGroupId: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      CreateSetRequestDTO: {
        type: "object";
        properties: {
          exerciseId: {
            type: "integer";
            format: "int32";
          };
          topRepRange: {
            type: "integer";
            format: "int32";
          };
          bottomRepRange: {
            type: "integer";
            format: "int32";
          };
          riR: {
            type: "integer";
            format: "int32";
          };
          type: {
            $ref: "#/components/schemas/SetType";
          };
        };
        additionalProperties: false;
      };
      CreateSplitCommentRequestDTO: {
        type: "object";
        properties: {
          comment: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      CreateSplitRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
          };
          isPublic: {
            type: "boolean";
          };
          workouts: {
            type: "array";
            items: {
              $ref: "#/components/schemas/CreateSplitWorkoutRequestDTO";
            };
          };
        };
        additionalProperties: false;
      };
      CreateSplitWorkoutRequestDTO: {
        type: "object";
        properties: {
          workoutId: {
            type: "string";
            format: "uuid";
          };
          day: {
            $ref: "#/components/schemas/DayOfWeek";
          };
        };
        additionalProperties: false;
      };
      CreateWorkoutCommentRequestDTO: {
        type: "object";
        properties: {
          comment: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      CreateWorkoutRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
            nullable: true;
          };
          isPublic: {
            type: "boolean";
          };
          sets: {
            type: "array";
            items: {
              $ref: "#/components/schemas/CreateSetRequestDTO";
            };
          };
        };
        additionalProperties: false;
      };
      DayOfWeek: {
        enum: [0, 1, 2, 3, 4, 5, 6];
        type: "integer";
        format: "int32";
      };
      DetailedExerciseResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
          image: {
            type: "string";
          };
          description: {
            type: "string";
          };
          isFavorite: {
            type: "boolean";
          };
          favorites: {
            type: "integer";
            format: "int32";
          };
          primaryMuscleGroups: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
            };
          };
          primaryMuscles: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleMuscleResponseDTO";
            };
          };
          secondaryMuscleGroups: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleMuscleGroupResponseDTO";
            };
          };
          secondaryMuscles: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleMuscleResponseDTO";
            };
          };
          equipment: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleEquipmentResponseDTO";
            };
          };
        };
        additionalProperties: false;
      };
      DetailedMuscleGroupResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
          muscles: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleMuscleResponseDTO";
            };
          };
        };
        additionalProperties: false;
      };
      DetailedPublicUserResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          image: {
            type: "string";
            nullable: true;
          };
          isMe: {
            type: "boolean";
          };
          followers: {
            type: "integer";
            format: "int32";
          };
          following: {
            type: "integer";
            format: "int32";
          };
          totalCompletedWorkouts: {
            type: "integer";
            format: "int32";
          };
          isFollowing: {
            type: "boolean";
          };
          joinedAt: {
            type: "string";
            format: "date-time";
          };
        };
        additionalProperties: false;
      };
      DetailedSetResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          topRepRange: {
            type: "integer";
            format: "int32";
          };
          bottomRepRange: {
            type: "integer";
            format: "int32";
          };
          exerciseId: {
            type: "integer";
            format: "int32";
          };
          type: {
            $ref: "#/components/schemas/SetType";
          };
          riR: {
            type: "integer";
            format: "int32";
          };
          weightUsedLastTime: {
            type: "number";
            format: "float";
          };
          repsCompletedLastTime: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      DetailedSplitResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
          isPublic: {
            type: "boolean";
          };
          description: {
            type: "string";
          };
          workouts: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleSplitWorkoutResponseDTO";
            };
          };
          likeCount: {
            type: "integer";
            format: "int32";
          };
          favoriteCount: {
            type: "integer";
            format: "int32";
          };
          commentCount: {
            type: "integer";
            format: "int32";
          };
          isLiked: {
            type: "boolean";
          };
          isFavorited: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      DetailedUserResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          image: {
            type: "string";
            nullable: true;
          };
          followers: {
            type: "integer";
            format: "int32";
          };
          following: {
            type: "integer";
            format: "int32";
          };
          totalCompletedWorkouts: {
            type: "integer";
            format: "int32";
          };
          currentSplit: {
            $ref: "#/components/schemas/DetailedUserSplitResponseDTO";
          };
          joinedAt: {
            type: "string";
            format: "date-time";
          };
        };
        additionalProperties: false;
      };
      DetailedUserSplitResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          workouts: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleSplitWorkoutResponseDTO";
            };
          };
        };
        additionalProperties: false;
      };
      DetailedWeekOfCompletedWorkoutsResponseDTO: {
        type: "object";
        properties: {
          split: {
            $ref: "#/components/schemas/DetailedUserSplitResponseDTO";
          };
          completedWorkouts: {
            type: "array";
            items: {
              $ref: "#/components/schemas/DayOfWeek";
            };
          };
        };
        additionalProperties: false;
      };
      DetailedWorkoutResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          isPublic: {
            type: "boolean";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
          sets: {
            type: "array";
            items: {
              $ref: "#/components/schemas/DetailedSetResponseDTO";
            };
          };
          exercises: {
            type: "array";
            items: {
              $ref: "#/components/schemas/SimpleExerciseResponseDTO";
            };
          };
          description: {
            type: "string";
            nullable: true;
          };
          likeCount: {
            type: "integer";
            format: "int32";
          };
          favoriteCount: {
            type: "integer";
            format: "int32";
          };
          commentCount: {
            type: "integer";
            format: "int32";
          };
          isLiked: {
            type: "boolean";
          };
          isFavorited: {
            type: "boolean";
          };
          alreadyAttempted: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      LoginUserRequestDTO: {
        type: "object";
        properties: {
          email: {
            type: "string";
          };
          password: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      NewWorkoutResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          isPublic: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      ProblemDetails: {
        type: "object";
        properties: {
          type: {
            type: "string";
            nullable: true;
          };
          title: {
            type: "string";
            nullable: true;
          };
          status: {
            type: "integer";
            format: "int32";
            nullable: true;
          };
          detail: {
            type: "string";
            nullable: true;
          };
          instance: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: {};
      };
      RegisterUserRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          email: {
            type: "string";
          };
          password: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      ResetPasswordUserRequestDTO: {
        type: "object";
        properties: {
          email: {
            type: "string";
          };
          newPassword: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SendForgotPasswordEmailRequestDTO: {
        type: "object";
        properties: {
          email: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SetType: {
        enum: [0, 1, 2, 3];
        type: "integer";
        format: "int32";
      };
      SimpleEquipmentResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SimpleExerciseResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
          image: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SimpleJWTResponseDTO: {
        type: "object";
        properties: {
          token: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SimpleMuscleGroupResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      SimpleMuscleResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "integer";
            format: "int32";
          };
          name: {
            type: "string";
          };
          muscleGroupId: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      SimpleSplitCommentResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          text: {
            type: "string";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
          createdAt: {
            type: "string";
            format: "date-time";
          };
          likeCount: {
            type: "integer";
            format: "int32";
          };
          isLiked: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      SimpleSplitResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
          isPublic: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      SimpleSplitWorkoutResponseDTO: {
        type: "object";
        properties: {
          workout: {
            $ref: "#/components/schemas/SimpleWorkoutResponseDTO";
          };
          day: {
            $ref: "#/components/schemas/DayOfWeek";
          };
        };
        additionalProperties: false;
      };
      SimpleUserResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          image: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      SimpleWeekOfCompletedWorkoutsResponseDTO: {
        type: "object";
        properties: {
          startDate: {
            type: "string";
            format: "date-time";
          };
          completedCount: {
            type: "integer";
            format: "int32";
          };
          totalCount: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      SimpleWorkoutCommentResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          text: {
            type: "string";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
          createdAt: {
            type: "string";
            format: "date-time";
          };
          likeCount: {
            type: "integer";
            format: "int32";
          };
          isLiked: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      SimpleWorkoutResponseDTO: {
        type: "object";
        properties: {
          id: {
            type: "string";
            format: "uuid";
          };
          name: {
            type: "string";
          };
          isPublic: {
            type: "boolean";
          };
          creator: {
            $ref: "#/components/schemas/SimpleUserResponseDTO";
          };
        };
        additionalProperties: false;
      };
      UpdateExerciseRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
          };
          image: {
            type: "string";
            nullable: true;
          };
          primaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          primaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          secondaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          secondaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          equipment: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
          };
          id: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      UpdatePasswordUserRequestDTO: {
        type: "object";
        properties: {
          oldPassword: {
            type: "string";
          };
          newPassword: {
            type: "string";
          };
        };
        additionalProperties: false;
      };
      UpdateSetRequestDTO: {
        type: "object";
        properties: {
          exerciseId: {
            type: "integer";
            format: "int32";
          };
          topRepRange: {
            type: "integer";
            format: "int32";
          };
          bottomRepRange: {
            type: "integer";
            format: "int32";
          };
          riR: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      UpdateSplitBaseInfoRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
          };
          isPublic: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
      UpdateSplitUserRequestDTO: {
        type: "object";
        properties: {
          splitId: {
            type: "string";
            format: "uuid";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      UpdateSplitWorkoutRequestDTO: {
        type: "object";
        properties: {
          newWorkoutId: {
            type: "string";
            format: "uuid";
          };
        };
        additionalProperties: false;
      };
      UpdateWorkoutBaseInfoRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
          };
          description: {
            type: "string";
            nullable: true;
          };
          isPublic: {
            type: "boolean";
          };
        };
        additionalProperties: false;
      };
    };
  };
};

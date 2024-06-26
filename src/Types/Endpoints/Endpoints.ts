export type MappedEndpoints = {
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
      get: {
        tags: ["Exercise"];
        parameters: [
          {
            name: "q";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/split/public/simple": {
      get: {
        tags: ["Split"];
        responses: {
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/split/personal/simple": {
      get: {
        tags: ["Split"];
        responses: {
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/refresh": {
      post: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/logout": {
      delete: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/me/resendconfirmationemail": {
      post: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/me/forgotpassword": {
      post: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/me/split/today/markascomplete": {
      post: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/user/unsafe/completedworkout": {
      post: {
        tags: ["User"];
        responses: {
          "200": {
            description: "OK";
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
          };
        };
      };
    };
    "/api/user/me/completedworkouts": {
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
          };
        };
      };
    };
    "/api/user/me/completedworkouts/week/{date}": {
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
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
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/workout/public/simple": {
      get: {
        tags: ["Workout"];
        responses: {
          "200": {
            description: "OK";
          };
        };
      };
    };
    "/api/workout/personal/simple": {
      get: {
        tags: ["Workout"];
        responses: {
          "200": {
            description: "OK";
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
          };
        };
      };
    };
  };
  components: {
    schemas: {
      CreateEquipmentRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      CreateExerciseRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
          description: {
            type: "string";
            nullable: true;
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
            nullable: true;
          };
          primaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          secondaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          secondaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          equipment: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      CreateMuscleGroupRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      CreateMuscleRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
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
          numberOfSets: {
            type: "integer";
            format: "int32";
          };
        };
        additionalProperties: false;
      };
      CreateSplitCommentRequestDTO: {
        type: "object";
        properties: {
          comment: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      CreateSplitRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
          description: {
            type: "string";
            nullable: true;
          };
          isPublic: {
            type: "boolean";
          };
          workouts: {
            type: "array";
            items: {
              $ref: "#/components/schemas/CreateSplitWorkoutRequestDTO";
            };
            nullable: true;
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
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      CreateWorkoutRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
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
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      DayOfWeek: {
        enum: [0, 1, 2, 3, 4, 5, 6];
        type: "integer";
        format: "int32";
      };
      LoginUserRequestDTO: {
        type: "object";
        properties: {
          email: {
            type: "string";
            nullable: true;
          };
          password: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      RegisterUserRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
          email: {
            type: "string";
            nullable: true;
          };
          password: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      ResetPasswordUserRequestDTO: {
        type: "object";
        properties: {
          newPassword: {
            type: "string";
            nullable: true;
          };
        };
        additionalProperties: false;
      };
      UpdateExerciseRequestDTO: {
        type: "object";
        properties: {
          name: {
            type: "string";
            nullable: true;
          };
          description: {
            type: "string";
            nullable: true;
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
            nullable: true;
          };
          primaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          secondaryMuscleGroups: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          secondaryMuscles: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
          };
          equipment: {
            type: "array";
            items: {
              type: "integer";
              format: "int32";
            };
            nullable: true;
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
            nullable: true;
          };
          newPassword: {
            type: "string";
            nullable: true;
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
    };
  };
};

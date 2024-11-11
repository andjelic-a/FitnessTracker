import { createContext } from "react";
import { Schema } from "../Types/Endpoints/SchemaParser";

const basicProfileInfoContext =
  createContext<Schema<"BasicUserPersonalInfoResponseDTO"> | null>(null);

export default basicProfileInfoContext;

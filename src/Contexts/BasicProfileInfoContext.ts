import { createContext } from "react";
import { Schema } from "../Types/Endpoints/SchemaParser";

const basicProfileInfoContext =
  createContext<Schema<"UserProfileBasicInfoResponseDTO"> | null>(null);

export default basicProfileInfoContext;

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import type { sessions } from "./interfaces/session";
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useSessionSelector = useSelector.withTypes<sessions>();

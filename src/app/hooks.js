import { useDispatch, useSelector } from "react-redux";
const useAppDispatch = useDispatch.withTypes();
const useAppSelector = useSelector.withTypes();
export {
  useAppDispatch,
  useAppSelector
};

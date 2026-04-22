export const apiResponse = ({
  success = true,
  message = "Request completed successfully",
  data = null,
  meta = null,
}) => ({
  success,
  message,
  data,
  meta,
});

import { FormKit } from "@form-kit/form-kit";
import { z } from "zod";

type LoginProps = {
  onSubmit: () => void;
};

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const Login = ({ onSubmit }: LoginProps) => {
  const handleSubmit = (e: z.infer<typeof schema>) => {
    console.log(e);
    onSubmit();
  };

  return <FormKit schema={schema} onSubmit={handleSubmit} />;
};

export default Login;

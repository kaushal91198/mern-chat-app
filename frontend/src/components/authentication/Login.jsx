import React, { useState } from "react";
import axios from 'axios'
import { useHistory } from "react-router-dom";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast
} from "@chakra-ui/react";

const Login = () => {
  const [show, setshow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const toast = useToast()


  const submitHandler = async () => {
    setLoading(true)
    if (!email || !password) {
      toast({
        title: 'Please Fill all the fields!',
        description: "warning",
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const { data } = await axios.post('/api/user/login', { email, password }, config)
      localStorage.setItem('userInfo', JSON.stringify(data))
      setLoading(false)
      toast({
        title: 'Login Successful',
        status: 'success',
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
      history.push('/chats')
    } catch (error) {
      toast({
        title: 'Error Occurred!',
        description: error.response.data.message,
        status: "error",
        position: 'bottom',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
      console.log(error)
    }

  }
  return (
    <VStack spacing="5px" color="black ">

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => {
                setshow(!show);
              }}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme='blue'
        width='100%'
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant='solid'
        colorScheme='red'
        width='100%'
        onClick={() => {
          setEmail('guest@gmail.com')
          setPassword('12345678')
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;

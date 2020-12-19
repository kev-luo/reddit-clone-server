import { AuthInput } from "src/resolvers/AuthInput"

export const validateRegister = (options: AuthInput) => {
  if (!options.email.includes("@")) {
    return [
      { 
        field: "email", 
        message: "Invalid email." 
      }
    ]

  }

  if (options.username.length <= 2) {
    return [
      { 
        field: "username", 
        message: "Username must be greater than 2 characters." 
      }
    ]

  }

  if (options.username.includes("@")) {
    return [
      { 
        field: "username", 
        message: "Username cannot include @." 
      }
    ]

  }

  if (options.password.length <= 3) {
    return [
      { 
        field: "password", 
        message: "Password must be greater than 3 characters." 
      }
    ]

  }

  return null
}
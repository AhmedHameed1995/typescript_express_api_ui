import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { string, object, TypeOf } from "zod"
import axios from 'axios'
import { useRouter } from 'next/router'

const createUserSchema = object({
    name: string({
        required_error: 'Name is required'
    }).nonempty({
        message: "Name should not be empty"
    }),
    email: string({
        required_error: 'Email is required'
    })
    .email('Not a Valid Email')
    .nonempty({
        message: "Email is required"
    }),
    password: string()
    .min(6, "Password to short - should be 6 chars minimum")
    .nonempty({
        message: "Password is required"
    }),
    passwordConfirmation: string()
    .nonempty({
        message: "Confirm password is required"
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"]
})

type CreateUserInput = TypeOf<typeof createUserSchema>

function RegisterPage() {
    const router = useRouter()
    const [registerError, setregisterError] = useState(null)
    const { 
        register, 
        formState: { errors },
        handleSubmit
    } = useForm<CreateUserInput>({
        resolver: zodResolver(createUserSchema)
    })

    async function onSubmit(values: CreateUserInput) {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`, 
                values
            )
            router.push("/")
        } catch(e) {
            setregisterError(e.message)
        }
    } 
    
    console.log({ errors })

    return (
        <>
            <p>{registerError}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-element">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" placeholder="Name" {...register("name")} />
                    <p>{errors.name?.message}</p>
                </div>
                <div className="form-element">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="Emails" {...register("email")} />
                    <p>{errors.email?.message}</p>
                </div>
                <div className="form-element">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="Password" {...register("password")} />
                    <p>{errors.password?.message}</p>
                </div>
                <div className="form-element">
                    <label htmlFor="passwordConfirmation">Confirm Password</label>
                    <input id="passwordConfirmation" type="password" placeholder="Confirm Password" {...register("passwordConfirmation")} />
                    <p>{errors.passwordConfirmation?.message}</p>
                </div>
                <button type="submit">Submit</button>
                
            </form>
        </>
    )
}

export default RegisterPage
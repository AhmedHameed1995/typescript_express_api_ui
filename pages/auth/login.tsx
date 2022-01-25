import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { string, object, TypeOf } from "zod"
import axios from 'axios'
import { useRouter } from 'next/router'

const createSessionSchema = object({
    email: string().nonempty({
        message: "Email is required",
    }),
    password: string().nonempty({
        message: "Password is required",
    }),
});

type CreateSessionInput = TypeOf<typeof createSessionSchema>

function LoginPage() {
    const router = useRouter()
    const [loginError, setLoginError] = useState(null)
    const { 
        register, 
        formState: { errors },
        handleSubmit
    } = useForm<CreateSessionInput>({
        resolver: zodResolver(createSessionSchema)
    })

    async function onSubmit(values: CreateSessionInput) {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`, 
                values,
                { withCredentials: true },
            )
            router.push("/")
        } catch(e) {
            setLoginError(e.message)
        }
    } 
    
    console.log({ errors })

    return (
        <>
            <p>{loginError}</p>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                <button type="submit">Submit</button>
                
            </form>
        </>
    )
}

export default LoginPage
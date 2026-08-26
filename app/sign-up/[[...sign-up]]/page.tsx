import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
    <main className="w-full grid grid-cols-1 md:grid-cols-2">
    <div className="relative flex-1 hidden items-center col-span-1 justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
            <h1 className="text-2xl font-bold text-blue-500">VIKB.IO</h1>
            <div className=" mt-16 space-y-3">
                <h3 className="text-white text-3xl font-bold">Start chasing your dreams worldwide.</h3>
                <p className="text-gray-300">
                    Create an account and get access to all features for 30-days, No credit card required.
                </p>
            </div>
        </div>
        <div
            className="absolute inset-0 my-auto h-[500px]"
            style={{
                background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)", filter: "blur(118px)"
            }}
        >

        </div>
    </div>
    <div className="h-screen w-full flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/"/>
    </div>
</main>
  )
}

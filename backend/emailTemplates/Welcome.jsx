/**
 * PROCESS: 
 * 1. create email template using react-email/components
 * 2. "npm run build " - from terminal : this creates using js files for node from the emailTemplates folder's JSX files
 * 3. use new js file where I would need to pull the original JSX email template, they are placed into the same folder for sanity
 **/
import react from 'react'
import {
  Body,
  Html,
  Container,
  Tailwind,
  Text,
  Button,
  Heading,
  Head,
} from '@react-email/components'

export default function Welcome(){
    return(
        <Html>
            <Head/>
            <Tailwind>
                <Body className='bg-white my-12 mx-auto font-sans'>
                    <Container className='p-8 rounded-lg shadow-lg'>
                        <Heading className='text-xl pt-4'>Hello there!</Heading>
                        <Text className='text-lg font-medium text-grey-700'>
                            Thanks for joining LemonWedge
                        </Text>
                        <Button className='bg-purple-700 text-white font-bold px-6 py-4 rounded-md' href='#'>Google</Button>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

"use client"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Navbar } from '@/components/navbar'

export default function ContactPage() {
  const form = useForm({ defaultValues: { name: '', email: '', phone: '', message: '' } })
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (data: any) => {
    setSubmitted(true)
    // TODO: Integrate backend/email API
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full space-y-8">
          <h1 className="text-4xl font-bold text-center mb-2">Contact Us</h1>
          <p className="text-center text-zinc-600 mb-8">Reach out for bookings, collaborations, or any inquiries. We usually respond within 24 hours.</p>
          <div className="bg-slate-50 rounded-lg shadow p-6 space-y-6">
            <div>
              <div className="font-semibold">Email:</div>
              <a href="mailto:hello@spacecalledblu.com" className="text-blue-600 hover:underline">hello@spacecalledblu.com</a>
            </div>
            <div>
              <div className="font-semibold">Phone:</div>
              <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91 12345 67890</a>
            </div>
            <div>
              <div className="font-semibold">Studio Address:</div>
              <div>Space Called Blu, Industrial Loft, Mumbai, India</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            {submitted ? (
              <div className="text-green-600 text-center font-semibold py-8">Thank you for your inquiry! We will get back to you soon.</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@email.com" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="message" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="How can we help you?" rows={5} {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full">Send Inquiry</Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  )
} 
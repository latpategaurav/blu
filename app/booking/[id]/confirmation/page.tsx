'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, moodboard:moodboards(title), model:models(name)`) 
        .eq('id', bookingId)
        .single();
      if (!error && data) {
        setBooking(data);
      }
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div>Loading booking details...</div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div>Booking not found.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-xl w-full">
          <CardHeader className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <CardTitle className="text-3xl text-center">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-lg text-green-700 font-semibold">
              Thank you for your payment. Your booking is confirmed.
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="font-semibold mb-2">Booking Summary</div>
              <div><strong>Moodboard:</strong> {booking.moodboard?.title || 'N/A'}</div>
              <div><strong>Model:</strong> {booking.model?.name || 'N/A'}</div>
              <div><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</div>
              <div><strong>Product Count:</strong> {booking.product_count}</div>
              <div><strong>Total Amount:</strong> ₹{booking.total_amount?.toLocaleString()}</div>
              <div><strong>Deposit Paid:</strong> ₹{booking.deposit_amount?.toLocaleString()}</div>
            </div>
            <div className="text-center text-zinc-700">
              A confirmation email with your booking details has been sent.<br />
              We look forward to seeing you at Space Called Blu!
            </div>
            <Button className="w-full mt-4" onClick={() => router.push('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 
import React, { useEffect, useRef } from 'react';

function EsewaPaymentForm({ paymentData }) {
    const formRef = useRef(null);

    useEffect(() => {
        // Auto-submit the form when component mounts
        if (formRef.current && paymentData) {
            formRef.current.submit();
        }
    }, [paymentData]);

    if (!paymentData) {
        return null;
    }

    return (
        <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4'>
            <div className='text-center mb-4'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d] mx-auto mb-4'></div>
                <h2 className='text-xl font-semibold text-gray-800'>Redirecting to eSewa...</h2>
                <p className='text-gray-600 mt-2'>Please wait while we redirect you to the payment gateway</p>
            </div>

            <form
                ref={formRef}
                action={paymentData.payment_url}
                method="POST"
                style={{ display: 'none' }}
            >
                <input type="text" name="amount" value={paymentData.amount} readOnly />
                <input type="text" name="tax_amount" value={paymentData.tax_amount} readOnly />
                <input type="text" name="total_amount" value={paymentData.total_amount} readOnly />
                <input type="text" name="transaction_uuid" value={paymentData.transaction_uuid} readOnly />
                <input type="text" name="product_code" value={paymentData.product_code} readOnly />
                <input type="text" name="product_service_charge" value={paymentData.product_service_charge} readOnly />
                <input type="text" name="product_delivery_charge" value={paymentData.product_delivery_charge} readOnly />
                <input type="text" name="success_url" value={paymentData.success_url} readOnly />
                <input type="text" name="failure_url" value={paymentData.failure_url} readOnly />
                <input type="text" name="signed_field_names" value={paymentData.signed_field_names} readOnly />
                <input type="text" name="signature" value={paymentData.signature} readOnly />
            </form>
        </div>
    );
}

export default EsewaPaymentForm;

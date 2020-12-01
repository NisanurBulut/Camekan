using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace Camekan.Entities
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Bekliyor")]
        Pending,

        [EnumMember(Value = "Ödeme Alındı")]
        PaymentReceived,

        [EnumMember(Value = "Ödeme işlemi Eksik")]
        PaymenyFailed

    }
}

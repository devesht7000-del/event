const TicketQR = ({ ticket }) => {
    const downloadQR = () => {
        // Create a link to download the QR code
        const downloadLink = document.createElement("a");
        downloadLink.href = ticket.qr_code;
        downloadLink.download = `ticket-${ticket.ticket_number}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="bento-card-dark p-6 text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                <img
                    src={ticket.qr_code}
                    alt={`QR Code for ${ticket.ticket_number}`}
                    className="w-48 h-48"
                />
            </div>
            <p className="text-sm font-semibold mb-1">Ticket: {ticket.ticket_number}</p>
            <p className="text-xs text-gray-400 mb-4">Status: {ticket.status.toUpperCase()}</p>
            <button onClick={downloadQR} className="btn-pill text-sm px-6 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
            </button>
        </div>
    );
};

export default TicketQR;

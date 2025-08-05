<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ID Card Anak Misioner</title>
    <style>
        @page {
            size: landscape;
            margin: 10mm;
        }
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f4f4f4;
        }

        .id-card {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 450px;
            overflow: hidden;
            box-sizing: border-box;
            height: auto;
        }

        .header {
            background-color: #a31545;
            color: white;
            padding: 10px;
            text-align: center;
        }

        .header h2 {
            margin: 0;
            font-size: 1.2em;
        }

        .header p {
            margin-top: 5px;
            font-size: 0.8em;
        }

        .content {
            padding: 15px;
            box-sizing: border-box;
        }

        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid #a31545;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 15px; /* Jarak dengan info */
        }

        .profile-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .info {
            flex-grow: 1;
        }

        .info p {
            margin: 5px 0;
            font-size: 0.9em;
        }

        .info strong {
            font-weight: bold;
        }

        .qrcode {
            width: 70px;
            height: 70px;
            margin-left: 15px; /* Jarak dengan info */
        }

        .qrcode img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .footer {
            padding: 10px;
            text-align: center;
            font-size: 0.7em;
            color: #777;
            border-top: 1px solid #ddd;
            margin-top: 15px;
        }

        table {
            width: 100%;
        }

        td {
            padding: 0;
            vertical-align: top;
        }
    </style>
</head>
<body>
    <div class="id-card">
        <div class="header">
            <h2>ID CARD ANAK MISIONER</h2>
            <p>GEREJA KOTABARU</p>
        </div>
        <div class="content">
            <table>
                <tr>
                    <td style="width: 100px;">
                        <div class="profile-image">
                            <img src="{{ $avatarBase64 ?? 'https://via.placeholder.com/150' }}" alt="Foto Siswa" class="student-photo">
                        </div>
                    </td>
                    <td>
                        <div class="info">
                            <p><strong>Nama:</strong> {{ $child->name }}</p>
                            <p><strong>Kelas:</strong> {{ $child->classModel->class_name ?? 'Not Enrolled' }}</p>
                        </div>
                    </td>
                    <td style="width: 70px;">
                        <div class="qrcode">
                            @if ($qrCodeBase64)
                                <img src="{{ $qrCodeBase64 }}" alt="QR Code" class="qr-code">
                                
                            @else
                                <div style="height: 130px; display: flex; align-items: center; justify-content: center; color: #999;">
                                    QR Code Not Generated
                                </div>
                            @endif
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div class="footer">
            <p></p>
        </div>
    </div>
</body>
</html>

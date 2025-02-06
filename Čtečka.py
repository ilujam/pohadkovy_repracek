from mfrc522 import MFRC522
import utime

reader = MFRC522(spi_id=0, sck=2, miso=4, mosi=3, cs=1, rst=0) 

print("\nPřilož čip ke čtečce\n")

PreviousCard = None

try:
    while True:
        reader.init()
        (stat, tag_type) = reader.request(reader.REQIDL)

        # Byla přiložena karta?
        if stat == reader.OK:
            (stat, uid) = reader.SelectTagSN()

            if stat == reader.OK:
                uid_hex = " ".join(["{:02X}".format(x) for x in uid])

                if uid != PreviousCard:
                    print(f"UID: {uid_hex}")
                    PreviousCard = uid
        else:
            PreviousCard = None

        utime.sleep_ms(50)

except KeyboardInterrupt:
    print("Čau")

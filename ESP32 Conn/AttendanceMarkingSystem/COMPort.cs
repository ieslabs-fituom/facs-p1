using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;

namespace AttendanceMarkingSystem
{
    internal class COMPort
    {
        SerialPort port;

        public COMPort(String name, int baudRate)
        {
            port = new SerialPort(name, baudRate, Parity.None, 8, StopBits.One);
            port.Open();
            port.Write("On");
        }
    }
}

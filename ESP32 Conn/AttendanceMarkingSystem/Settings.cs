using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace AttendanceMarkingSystem
{
    public partial class Settings : Form
    {
        public Settings()
        {
            InitializeComponent();

            foreach (string portsw in SerialPort.GetPortNames())
            {
                ComboBoxPortList.Items.Add(portsw);
            }
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {

        }
    }
}

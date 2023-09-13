using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO.Ports;
using System.Web.UI.WebControls;

namespace AttendanceMarkingSystem
{
    public partial class Home : Form
    {
        List<String> portList = new List<String>();
        SerialPort port;

        public Home()
        {
            InitializeComponent();

            foreach (string portsw in SerialPort.GetPortNames())
            {
                portList.Add(portsw);
            }
        }

        private void btnSettings_Click(object sender, EventArgs e)
        {
            Settings settings = new Settings();
            settings.ShowDialog();
        }

        private void Home_Load(object sender, EventArgs e)
        {

        }
    }
}

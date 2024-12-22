import React from 'react';
import './packages.css'; // Import the associated CSS

const Packages = () => {
  return (
    <section className="packages">
      <div className="container">
        <div className="row">
          {/* North India */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/images/north-india.jpg" alt="North India" className="img-fluid"/>
                </div>
                <div className="flip-card-back">
                  <h4>NORTH INDIA</h4>
                  <a className="zone-card" href="http://www.uptourism.gov.in/">Uttar Pradesh</a><br />
                  <a className="zone-card" href="http://delhitourism.gov.in/">Delhi</a><br />
                  <a className="zone-card" href="https://himachaltourism.gov.in/">Himachal Pradesh</a><br />
                  <a className="zone-card" href="http://bstdc.bih.nic.in/">Bihar</a><br />
                  <a className="zone-card" href="http://punjabtourism.gov.in/">Punjab</a><br />
                 
                </div>
              </div>
            </div>
          </div>
          
          {/* South India */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/images/south-india.jpg" alt="South India" className="img-fluid"/>
                </div>
                <div className="flip-card-back">
                  <h4>SOUTH INDIA</h4>
                  <a className="zone-card" href="https://www.telanganatourism.gov.in/">Telangana</a><br />
                  <a className="zone-card" href="https://tourism.ap.gov.in/">Andhra Pradesh</a><br />
                  <a className="zone-card" href="http://www.tamilnadutourism.org/">Tamil Nadu</a><br />
                  <a className="zone-card" href="https://www.karnatakatourism.org/">Karnataka</a><br />
                  <a className="zone-card" href="https://www.keralatourism.org/">Kerala</a><br />
                
                </div>
              </div>
            </div>
          </div>
          
          {/* West & Central India */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/images/west-india.jpg" alt="West India" className="img-fluid"/>
                </div>
                <div className="flip-card-back">
                  <h4>WEST & CENTRAL INDIA</h4>
                  <a className="zone-card" href="http://www.tourism.rajasthan.gov.in/">Rajasthan</a><br />
                  <a className="zone-card" href="https://www.gujarattourism.com/">Gujarat</a><br />
                  <a className="zone-card" href="https://www.maharashtratourism.gov.in/">Maharashtra</a><br />
                  <a className="zone-card" href="http://www.mptourism.com/">Madhya Pradesh</a><br />
                  <a className="zone-card" href="http://cggovttourism.ddns.net/">Chhattisgarh</a><br />
                </div>
              </div>
            </div>
          </div>
          
          {/* East India */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="/images/east-india.jpg" alt="East India" className="img-fluid"/>
                </div>
                <div className="flip-card-back">
                  <h4>EAST INDIA</h4>
                  <a className="zone-card" href="http://westbengaltourism.gov.in/">West Bengal</a><br />
                  <a className="zone-card" href="http://meghalayatourism.in/">Meghalaya</a><br />
                  <a className="zone-card" href="http://arunachaltourism.com/">Arunachal Pradesh</a><br />
                  <a className="zone-card" href="https://tourism.assam.gov.in/">Assam</a><br />
                  <a className="zone-card" href="http://nagalandtourism.com/">Nagaland</a><br />
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;

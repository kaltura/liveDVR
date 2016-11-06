yum groupinstall "Development tools" && yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel
cd /usr/local/src/
wget http://python.org/ftp/python/2.7.6/Python-2.7.6.tar.xz
tar xf Python-2.7.6.tar.xz
cd Python-2.7.6
./configure --prefix=/usr/local --enable-unicode=ucs4 --enable-shared LDFLAGS="-Wl,-rpath /usr/local/lib"
make && make altinstall
sudo wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py
wget https://bootstrap.pypa.io/ez_setup.py
python2.7 ez_setup.py
easy_install-2.7 pip

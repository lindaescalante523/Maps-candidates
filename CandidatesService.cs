using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CandidatesService : ICandidatesService
    {
        IDataProvider _dataProvider = null;
        ILookUpMapper _lookUp = null;
        IPartyMapper _partyMapper = null;

        public CandidatesService(IDataProvider dataProvider,ILookUpMapper lookUp, IPartyMapper partyMapper)
        {
            _dataProvider = dataProvider;
            _lookUp = lookUp;
            _partyMapper = partyMapper;
        }
   
    
        public Candidate GetById(int id)
        {
            string procName = "[dbo].[Candidates_Select_ById_v3]";

            Candidate candidate = null;

            _dataProvider.ExecuteCmd(procName,
                delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@SelectedId", id);
                },
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    candidate = MapCandidate(reader, ref startingIndex);
                });

            return candidate;
        }

        public int Add(CandidateAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Candidates_Insert]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                delegate (SqlParameterCollection returnCol)
                {
                    object objId = returnCol["@Id"].Value;

                    Int32.TryParse(objId.ToString(), out id);
                });

            return id;
        }

        public void Update(CandidateUpdateRequest model)
        {
            string procName = "[dbo].[Candidates_Update]";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    AddCommonParams(model, col);
                });
        }

        public List<Candidate> GetAll()
        {
            List<Candidate> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Candidates_SelectAll_v2]";

            _dataProvider.ExecuteCmd(procName,
                (param) => {},
                (IDataReader reader, short recordSetIndex) =>
                {
                    int startingIndex = 0;

                    //Candidate aCandidate = MapCandidate(reader, ref startingIndex);
                    Candidate aCandidate = new Candidate();

                    aCandidate.Id = reader.GetSafeInt32(startingIndex++);
                    aCandidate.GivenName = reader.GetSafeString(startingIndex++);
                    aCandidate.Surnames = reader.GetSafeString(startingIndex++);
                    aCandidate.GenderType = _lookUp.MapLookUp<int>(reader, ref startingIndex);
                  
                    aCandidate.Age = reader.GetSafeInt32(startingIndex++);
                    aCandidate.AvatarUrl = reader.GetSafeString(startingIndex++);
                    aCandidate.Party = _partyMapper.MapParty(reader, ref startingIndex);
                    aCandidate.ElectionDate = reader.GetDateTime(startingIndex++);
                    //aCandidate.ElectionId = reader.GetSafeByte(startingIndex++);
                    aCandidate.ElectionType = _lookUp.MapLookUp<Byte>(reader, ref startingIndex);
                    aCandidate.StatusType = _lookUp.MapLookUp<int>(reader, ref startingIndex);
                    aCandidate.IsElected = reader.GetSafeBool(startingIndex++);
                    aCandidate.DateCreated = reader.GetDateTime(startingIndex++);
                    aCandidate.DateModified = reader.GetDateTime(startingIndex++);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Candidate>();
                    }
                    list.Add(aCandidate);
                });

            return list;

        }
        public Paged<Candidate> GetByPartyId(int partyId, int pageIndex, int pageSize)
        { 
             Paged<Candidate> pagedList = null;
             List<Candidate> list = null;
             int totalCount = 0;
        
            string procName = "dbo.Candidates_SelectbyPartyId";
          _dataProvider.ExecuteCmd(procName,
          (param) =>
            {
                param.AddWithValue("@PartyId", partyId );
                param.AddWithValue("@pageIndex", pageIndex);
                param.AddWithValue("@pageSize", pageSize);
            },
                (IDataReader reader, short recordSetIndex) =>
                {
                    int startingIndex = 0;

                    Candidate aCandidate = MapCandidate(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    };

                    if (list == null)
                    {
                        list = new List<Candidate>();
                    };
                    list.Add(aCandidate);

                }
                    );
            if (list != null)
            {
                pagedList = new Paged<Candidate>(list, pageIndex, pageSize, totalCount);
            };

            return pagedList;
        }


        public Paged<Candidate> Pagination(int pageIndex, int pageSize)
        {
            Paged<Candidate> pagedList = null;
            List<Candidate> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Candidates_SelectAll_Paginated_v3]";

            _dataProvider.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@pageIndex", pageIndex);
                    param.AddWithValue("@pageSize", pageSize);
                },
                (IDataReader reader, short recordSetIndex) =>
                {
                    int startingIndex = 0;

                    Candidate aCandidate = MapCandidate(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Candidate>();
                    }
                    list.Add(aCandidate);
                });

            if(list != null)
            {
                pagedList = new Paged<Candidate>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        
        public void Delete(int id)
        {
            string procName = "[dbo].[Candidates_Delete_ById]";
            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                });
        }

        public Paged<Candidate> SearchPaginate(string query, int pageIndex, int pageSize)
        {
            Paged<Candidate> pagedList = null;
            List<Candidate> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(
                "[dbo].[Candidates_Search_v3]",
                (param) =>
                {
                    param.AddWithValue("@query", query);
                    param.AddWithValue("@pageIndex", pageIndex);
                    param.AddWithValue("@pageSize", pageSize);
                },
                (IDataReader reader, short recordSetIndex) =>
                {
                    int startingIndex = 0;

                    Candidate aCandidate = MapCandidate(reader, ref startingIndex);

                    if(totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    };

                    if(list == null)
                    {
                        list = new List<Candidate>();
                    };
                    list.Add(aCandidate);
                }
                    );
            if(list != null)
            {
                pagedList = new Paged<Candidate>(list, pageIndex, pageSize, totalCount);
            };

            return pagedList;
        }

        public int AddGroup(AddGroupRequest model, int groupId)
        {
            int id = 0;

            string procName = "[dbo].[Group_Test_Table}";

            _dataProvider.ExecuteNonQuery(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@GivenName", model.GivenName);
                    col.AddWithValue("@Surnames", model.Surnames);
                    col.AddWithValue("@GenderTypeId", model.GenderType);
                    col.AddWithValue("@Age", model.Age);
                    col.AddWithValue("@AvatarUrl", model.AvatarUrl);
                    col.AddWithValue("@ElectionDate", model.ElectionDate);
                    col.AddWithValue("@ElectionTypeId", model.ElectionType);
                    col.AddWithValue("@StatusId", model.StatusType);
                    col.AddWithValue("@IsElected", model.IsElected);
                    col.AddWithValue("@DateCreated", model.DateCreated);
                    col.AddWithValue("@DateCreated", model.DateModified);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                delegate (SqlParameterCollection returnCol)
                {
                    object objId = returnCol["@Id"].Value;

                    Int32.TryParse(objId.ToString(), out id);
                });

            return id;
        }

        private static void AddCommonParams(CandidateAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@GivenName", model.GivenName);
            col.AddWithValue("@Surnames", model.Surnames);
            col.AddWithValue("@GenderTypeId", model.GenderTypeId);
            col.AddWithValue("@Age", model.Age);
            col.AddWithValue("@AvatarUrl", model.AvatarUrl);
            col.AddWithValue("@PartyId", model.PartyId);
            col.AddWithValue("@ElectionId", model.ElectionId);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("@IsElected", model.IsElected);
        }
        public Candidate MapCandidate(IDataReader reader, ref int startingIndex)
        {
            Candidate aCandidate = new Candidate();

            aCandidate.Id = reader.GetSafeInt32(startingIndex++);
            aCandidate.GivenName = reader.GetSafeString(startingIndex++);
            aCandidate.Surnames = reader.GetSafeString(startingIndex++);
            aCandidate.GenderType = _lookUp.MapLookUp<int>(reader,ref startingIndex);
            aCandidate.Age = reader.GetSafeInt32(startingIndex++);
            aCandidate.AvatarUrl = reader.GetSafeString(startingIndex++);
            aCandidate.Party = _partyMapper.MapParty(reader, ref startingIndex);
            aCandidate.ElectionDate = reader.GetDateTime(startingIndex++);
            aCandidate.ElectionId = reader.GetSafeInt32(startingIndex++);
            aCandidate.ElectionType = _lookUp.MapLookUp<Byte>(reader, ref startingIndex);
            aCandidate.StatusType = _lookUp.MapLookUp<int>(reader, ref startingIndex);
            aCandidate.IsElected = reader.GetSafeBool(startingIndex++);
            aCandidate.DateCreated = reader.GetDateTime(startingIndex++);
            aCandidate.DateModified = reader.GetDateTime(startingIndex++);

            return aCandidate;
        }

    }
}
